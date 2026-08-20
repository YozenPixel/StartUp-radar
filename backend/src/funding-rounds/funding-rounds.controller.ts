import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FundingRoundsService } from './funding-rounds.service';
import { CreateFundingRoundDto } from './dto/create-funding-round.dto';

@Controller('funding-rounds')
export class FundingRoundsController {
  constructor(private readonly fundingRoundsService: FundingRoundsService) {}

  @Get()
  findAll(@Query('startupId') startupId?: string) {
    return this.fundingRoundsService.findAll(startupId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fundingRoundsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFundingRoundDto: CreateFundingRoundDto) {
    return this.fundingRoundsService.create(createFundingRoundDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.fundingRoundsService.remove(id);
  }
}
