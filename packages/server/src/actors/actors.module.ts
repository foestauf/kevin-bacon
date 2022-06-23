import { Module } from '@nestjs/common';
import { ActorsService } from './actors.service';
import { ActorsController } from './actors.controller';
import { ActorEntity } from './entities/actor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ActorBulkUpdate } from './actors.worker';
import { MovieEntity } from 'src/movies/entities/movie.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActorEntity, MovieEntity]),
    BullModule.registerQueue({
      name: 'actor-bulk-update',
    }),
  ],
  controllers: [ActorsController],
  providers: [ActorsService, ActorBulkUpdate],
  exports: [TypeOrmModule],
})
export class ActorsModule {}
