import { Module } from '@nestjs/common';
import { FundingRoundsService } from './funding-rounds.service';
import { FundingRoundsController } from './funding-rounds.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FundingRoundsController],
  providers: [FundingRoundsService],
  exports: [FundingRoundsService],
})
export class FundingRoundsModule {}
