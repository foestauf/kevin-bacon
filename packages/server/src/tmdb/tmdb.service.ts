import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { axiosClient } from "src/utils/axiosClient";
import { Repository } from "typeorm";
import { TMDBEntity } from "./tmdb.entity";
import dayjs from "dayjs";

@Injectable()
export class TmdbService {
  constructor(
    @InjectRepository(TMDBEntity)
    private readonly tmdbRepo: Repository<TMDBEntity>
  ) {}

  async getConfig(): Promise<TMDBEntity> {
    const config = await this.tmdbRepo.findOne({
      where: { type: "CONFIG" },
      cache: true,
    });
    if (!config.updatedAt || dayjs().diff(config.updatedAt, "day") > 30) {
      return this.updateConfig();
    }
    return config;
  }

  async updateConfig(): Promise<TMDBEntity> {
    const data = await axiosClient
      .get(`https://api.themoviedb.org/3/configuration`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    console.log("data", data);
    const newConfig = await this.tmdbRepo
      .createQueryBuilder()
      .insert()
      .into(TMDBEntity)
      .values({
        base_url: data.images.base_url,
        secure_base_url: data.images.secure_base_url,
        backdrop_sizes: data.images.backdrop_sizes,
        logo_sizes: data.images.logo_sizes,
        poster_sizes: data.images.poster_sizes,
        profile_sizes: data.images.profile_sizes,
        still_sizes: data.images.still_sizes,
        change_keys: data.change_keys,
        updatedAt: new Date(),
      })
      .orUpdate(
        [
          "base_url",
          "secure_base_url",
          "backdrop_sizes",
          "logo_sizes",
          "poster_sizes",
          "profile_sizes",
          "still_sizes",
          "change_keys",
        ],
        ["type"]
      )
      .execute();
    return this.tmdbRepo.findOne({
      where: { type: "CONFIG" },
      cache: true,
    });
  }
}
