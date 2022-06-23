import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { BullModule } from '@nestjs/bull';
import { MovieBulkUpdateWorker } from './movies.worker';
import { ActorEntity } from 'src/actors/entities/actor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieEntity, ActorEntity]),
    BullModule.registerQueue({
      name: 'movie-bulk-update',
    }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, MovieBulkUpdateWorker],
  exports: [TypeOrmModule],
})
export class MoviesModule {}
