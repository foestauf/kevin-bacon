import { Controller, Get } from "@nestjs/common";
import { TmdbService } from "src/tmdb/tmdb.service";

@Controller("tmdb")
export class TMDBController {
  constructor(private readonly TmdbService: TmdbService) {}
  @Get("config")
  getConfig() {
    return this.TmdbService.getConfig();
  }
}
