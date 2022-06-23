import {
  Controller,
  Get,
  Post,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ActorsService } from './actors.service';
import { ActorEntity } from './entities/actor.entity';

@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}
  @Get()
  findAll(@Query('name') name: string): Promise<ActorEntity[]> {
    return this.actorsService.searcActorsByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ActorEntity> {
    return this.actorsService.findOne(id);
  }

  @Post()
  performSync() {
    return this.actorsService.actorBulkUpdate();
  }

  @Put(':id')
  async updateOne(@Param('id') id: number) {
    return this.actorsService.updateActorDetails(id);
  }
}
