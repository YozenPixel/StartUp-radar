import { Controller, Get, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Vérification de l\'état de santé de l\'API et de la base de données' })
  @ApiResponse({ status: 200, description: 'Tous les services sont opérationnels' })
  @ApiResponse({ status: 503, description: 'Un service critique est inaccessible' })
  async check() {
    const startTime = Date.now();
    let dbStatus = 'healthy';
    let dbError: string | undefined = undefined;

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      dbStatus = 'unreachable';
      dbError = (error as Error).message;
    }

    const isHealthy = dbStatus === 'healthy';

    const payload = {
      status: isHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - startTime,
      services: {
        database: {
          status: dbStatus,
          ...(dbError ? { error: dbError } : {}),
        },
      },
    };

    if (!isHealthy) {
      throw new HttpException(payload, HttpStatus.SERVICE_UNAVAILABLE);
    }

    return payload;
  }
}
