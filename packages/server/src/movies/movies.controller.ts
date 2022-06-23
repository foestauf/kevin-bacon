import { Controller, Post, Put, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  bulkUpdate() {
    this.moviesService.movieBulkUpdate();
  }

  @Put(':id')
  updateOne(@Param('id') id: number) {
    return this.moviesService.updateMovieDetails(id);
  }
}
