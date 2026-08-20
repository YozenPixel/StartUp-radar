import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { StartupsModule } from './startups/startups.module';
import { FundingRoundsModule } from './funding-rounds/funding-rounds.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    StartupsModule,
    FundingRoundsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
