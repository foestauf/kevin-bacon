import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActorEntity } from './entities/actor.entity';

@Processor('actor-bulk-update')
export class ActorBulkUpdate {
  constructor(
    @InjectRepository(ActorEntity)
    private readonly actorsRepo: Repository<ActorEntity>,
  ) {}

  @Process()
  async process(job) {
    console.log(job.data);
    return this.actorsRepo
      .upsert(job.data, ['tmdbId'])
      .then((res) => {
        job.finished();
        return res;
      })
      .catch((err) => console.log(err));
  }

  @OnQueueActive()
  onActive(job) {
    `Processing job ${job.id} with data ${job.data}`;
  }

  @OnQueueCompleted()
  onCompleted(job) {
    `Job ${job.id} with data ${job.data} has been completed`;
  }
}
