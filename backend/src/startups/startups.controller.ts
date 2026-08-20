import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StartupsService } from './startups.service';
import { CreateStartupDto } from './dto/create-startup.dto';
import { UpdateStartupDto } from './dto/update-startup.dto';
import { FindStartupsQueryDto } from './dto/find-startups-query.dto';

@Controller('startups')
export class StartupsController {
  constructor(private readonly startupsService: StartupsService) {}

  @Get('metrics')
  getMetrics() {
    return this.startupsService.getMetrics();
  }

  @Get()
  findAll(@Query() query: FindStartupsQueryDto) {
    return this.startupsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.startupsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createStartupDto: CreateStartupDto) {
    return this.startupsService.create(createStartupDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStartupDto: UpdateStartupDto,
  ) {
    return this.startupsService.update(id, updateStartupDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.startupsService.remove(id);
  }
}
