import { Injectable } from "@nestjs/common";
import { chain } from "stream-chain";
import { parser } from "stream-json/jsonl/Parser";

import * as zlib from "zlib";
import axios from "axios";
import { InjectRepository } from "@nestjs/typeorm";
import { MovieEntity } from "./entities/movie.entity";
import { Repository } from "typeorm";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { axiosClient } from "../utils/axiosClient";
import { ActorEntity } from "src/actors/entities/actor.entity";

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepo: Repository<MovieEntity>,
    @InjectRepository(ActorEntity)
    private readonly actorRepo: Repository<ActorEntity>,
    @InjectQueue("movie-bulk-update")
    private readonly movieBulkUpdateQueue: Queue
  ) {}

  async updateMovieDetails(tmdbId: number) {
    let movie = new MovieEntity();
    const data = await axiosClient
      .get(
        `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US&append_to_response=credits`
      )
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const actors = await Promise.all(
      data.credits.cast.map(async (actor) => {
        await this.actorRepo.upsert(
          {
            tmdbId: actor.id,
            name: actor.name,
            popularity: actor.popularity,
            profile_path: actor.profile_path,
          },
          ["tmdbId"]
        );
        return this.actorRepo.findOne({ where: { tmdbId: actor.id } });
      })
    );
    const newMovie = await this.movieRepo
      .createQueryBuilder()
      .insert()
      .into(MovieEntity)
      .values({
        original_title: data.original_title,
        overview: data.overview,
        poster_path: data.poster_path,
        release_date: data.release_date,
        runtime: data.runtime,
        tagline: data.tagline,
        title: data.title,
        vote_average: data.vote_average,
        vote_count: data.vote_count,
        budget: data.budget,
        revenue: data.revenue,
        status: data.status,
        homepage: data.homepage,
        imdb_id: data.imdb_id,
        popularity: data.popularity,
        original_language: data.original_language,
        tmdbId: data.id,
      })
      .orUpdate(
        [
          "overview",
          "poster_path",
          "release_date",
          "runtime",
          "tagline",
          "title",
          "vote_average",
          "vote_count",
          "budget",
          "revenue",
          "status",
          "homepage",
          "imdb_id",
          "popularity",
          "original_language",
          "updatedAt",
        ],
        ["tmdbId"]
      )
      .returning("*")
      .execute()
      .then(async (res) => {
        movie = await this.movieRepo.findOne({
          where: { tmdbId },
          relations: {
            actors: true,
          },
        });

        const newActors = actors.filter((actor) => {
          return !movie.actors.find((a) => a.tmdbId === actor.tmdbId);
        });

        await this.actorRepo
          .createQueryBuilder()
          .update(MovieEntity)
          .where("tmdbId = :tmdbId", { tmdbId })
          .relation(MovieEntity, "actors")
          .of(movie)
          .add(newActors)
          .catch((err) => console.log(err));
        return res;
      });
    return { movie: movie, data: data, newMovie };
  }

  async movieBulkUpdate() {
    const gunzip = zlib.createGunzip();
    axios
      .get("http://files.tmdb.org/p/exports/movie_ids_03_28_2022.json.gz", {
        responseType: "stream",
      })
      .then((res) => res.data.pipe(pipeline.input));
    const pipeline = chain([gunzip, parser()]);

    pipeline.on("data", (data) => {
      this.movieBulkUpdateQueue.add({
        tmdbId: data.value.id,
        original_title: data.value.original_title,
        popularity: data.value.popularity,
      });
    });

    pipeline.on("end", () => {
      console.log("end");
    });
  }
}
