import { Injectable } from "@nestjs/common";
import { chain } from "stream-chain";
import { parser } from "stream-json/jsonl/Parser";

import * as zlib from "zlib";
import axios from "axios";
import { InjectRepository } from "@nestjs/typeorm";
import { ActorEntity } from "./entities/actor.entity";
import { Repository } from "typeorm";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { axiosClient } from "src/utils/axiosClient";
import { MovieEntity } from "src/movies/entities/movie.entity";
import { TmdbService } from "src/tmdb/tmdb.service";
import { ActorProfile } from "./types";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dayjs = require("dayjs");

@Injectable()
export class ActorsService {
  constructor(
    @InjectRepository(ActorEntity)
    private readonly actorsRepo: Repository<ActorEntity>,
    @InjectQueue("actor-bulk-update")
    private readonly actorBulkUpdateQueue: Queue,
    @InjectRepository(MovieEntity)
    private readonly movieRepo: Repository<MovieEntity>,
    private readonly tmdbService: TmdbService
  ) {}

  counter = 0;

  async findAll(): Promise<ActorEntity[]> {
    return await this.actorsRepo.find();
  }

  async getPersonDetails(id: string) {
    const actorEntity = this.findOne(id);
  }

  async getPersonImages(id: string) {
    const config = this.tmdbService.getConfig();
    const person = await this.actorsRepo.findOneOrFail({
      where: { id },
      relations: {
        profileImages: true,
      },
    });
  }

  async fetchPersonProfileImages(tmdbId: number) {
    const {
      data: { profiles },
    } = await axiosClient.get(`/person/${tmdbId}/images`);
    return profiles;
  }

  async findOne(id: string): Promise<ActorEntity> {
    const actor = await this.actorsRepo
      .findOneOrFail({
        where: { id },
        relations: {
          movies: true,
        },
      })
      .then(async (actorEntity) => {
        const day = dayjs();
        // Adult is intentionally left null so we know if this actor has ever been updated or not
        if (
          actorEntity.adult === null ||
          day.diff(actorEntity.updatedAt, "day") > 30
        ) {
          const updatedActor = await this.updateActorDetails(
            actorEntity.tmdbId
          ).then((res) =>
            this.actorsRepo.findOne({
              where: { id: res.actor.id },
              relations: ["movies"],
            })
          );
          return updatedActor;
        }
        return actorEntity;
      });
    return actor;
  }

  async updateActorDetails(tmdbId: number) {
    let actor = new ActorEntity();
    const data = await axiosClient
      .get(
        `https://api.themoviedb.org/3/person/${tmdbId}?language=en-US&append_to_response=movie_credits`
      )
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const movies = await Promise.all(
      data.movie_credits.cast.map(async (movie) => {
        await this.movieRepo.upsert(
          {
            tmdbId: movie.id,
            title: movie.title,
            original_title: movie.original_title,
            overview: movie.overview,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            vote_count: movie.vote_count,
          },
          ["tmdbId"]
        );
        return this.movieRepo.findOne({
          where: {
            tmdbId: movie.id,
          },
        });
      })
    );

    const newActor = await this.actorsRepo
      .createQueryBuilder()
      .insert()
      .into(ActorEntity)
      .values({
        tmdbId,
        name: data.name,
        profile_path: data.profile_path,
        birthday: data.birthday,
        adult: data.adult,
        gender: data.gender,
        known_for_department: data.known_for_department,
        deathday: data.deathday,
        biography: data.biography,
        place_of_birth: data.place_of_birth,
        profileImages: await this.fetchPersonProfileImages(tmdbId),
        imdb_id: data.imdb_id,
        homepage: data.homepage,
        popularity: data.popularity,
      })
      .orUpdate(
        [
          "name",
          "profile_path",
          "birthday",
          "adult",
          "gender",
          "known_for_department",
          "deathday",
          "biography",
          "place_of_birth",
          "profileImages",
          "imdb_id",
          "homepage",
          "popularity",
          "updatedAt",
        ],
        ["tmdbId"]
      )
      .returning("*")
      .execute()
      .then(async (res) => {
        actor = await this.actorsRepo.findOne({
          where: { tmdbId },
          relations: {
            movies: true,
          },
        });

        const newMovies = movies.filter((movie) => {
          return !actor.movies.find(
            (actorMovie) => actorMovie.tmdbId === movie.tmdbId
          );
        });

        await this.actorsRepo
          .createQueryBuilder()
          .update(ActorEntity)
          .where("tmdbId = :tmdbId", { tmdbId })
          .relation(ActorEntity, "movies")
          .of(actor)
          .add(newMovies)
          .catch((err) => console.log(err));
        // await this.actorsRepo
        //   .createQueryBuilder()
        //   .update(ActorEntity)
        //   .where("tmdbId = :tmdbId", { tmdbId })
        //   .execute()
        //   .catch((err) => console.log(err));
        return res;
      });

    return { actor: actor, data: data, newActor };
  }

  async actorBulkUpdate() {
    const gunzip = zlib.createGunzip();
    axios
      .get("http://files.tmdb.org/p/exports/person_ids_03_28_2022.json.gz", {
        responseType: "stream",
      })
      .then((res) => res.data.pipe(pipeline.input));
    const pipeline = chain([gunzip, parser()]);

    pipeline.on("data", (data) => {
      this.counter++;
      this.actorBulkUpdateQueue.add({
        tmdbId: data.value.id,
        name: data.value.name,
      });
    });

    pipeline.on("line", (line) => {
      console.log(line);
    });

    pipeline.on("end", () => {
      console.log("end");
      console.log(this.counter);
    });
  }

  async searcActorsByName(name: string) {
    const query = this.actorsRepo.createQueryBuilder("actor");
    query.where("actor.name ILIKE :name", { name: `${name}%` });
    query.andWhere("actor.known_for_department = :known_for_department", {
      known_for_department: "Acting",
    });
    query.andWhere("actor.adult = :adult", { adult: false });
    query.andWhere("actor.popularity > :popularity", { popularity: 1 });
    query.select(["actor.name", "actor.tmdbId", "actor.id"]);
    query.orderBy("actor.popularity", "DESC");
    query.take(10);
    return await query.getMany();
  }
}
