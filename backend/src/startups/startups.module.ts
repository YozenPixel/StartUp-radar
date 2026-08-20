import { Module } from '@nestjs/common';
import { StartupsService } from './startups.service';
import { StartupsController } from './startups.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StartupsController],
  providers: [StartupsService],
  exports: [StartupsService],
})
export class StartupsModule {}
