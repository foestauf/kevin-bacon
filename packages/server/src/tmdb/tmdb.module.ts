import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TMDBEntity } from "./tmdb.entity";
import { TmdbService } from "./tmdb.service";
import { TMDBController } from "./tmdb.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TMDBEntity])],
  controllers: [TMDBController],
  providers: [TmdbService],
  exports: [TypeOrmModule],
})
export class TmdbModule {}
