import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieEntity } from './entities/movie.entity';

@Processor('movie-bulk-update')
export class MovieBulkUpdateWorker {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly moviesRepo: Repository<MovieEntity>,
  ) {}

  @Process()
  async process(job) {
    console.log(job.data);
    return this.moviesRepo
      .upsert(job.data, ['tmdbId'])
      .then((res) => {
        job.finished();
        return res;
      })
      .catch((err) => console.log(err));
  }
}
