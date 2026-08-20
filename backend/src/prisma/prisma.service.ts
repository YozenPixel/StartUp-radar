import { Injectable, OnModuleInit, OnModuleDestroy, Optional } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor(@Optional() private configService?: ConfigService) {
    const connectionString =
      configService?.get<string>('DATABASE_URL') ||
      process.env.DATABASE_URL ||
      'postgresql://postgres:password@localhost:5432/startupradar?schema=public';

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({ adapter });
    this.pool = pool;
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.warn('⚠️ Connexion Prisma différée (base non joignable au démarrage) :', (error as Error).message);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      await this.pool.end();
    } catch {
      // Nettoyage silencieux à l'arrêt
    }
  }
}
