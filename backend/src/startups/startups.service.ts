import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStartupDto } from './dto/create-startup.dto';
import { UpdateStartupDto } from './dto/update-startup.dto';
import { FindStartupsQueryDto } from './dto/find-startups-query.dto';
import { Prisma, Startup } from '@prisma/client';

export interface PaginatedStartupsResponse {
  data: (Startup & { fundingRound?: any[] })[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardMetricsResponse {
  totalStartups: number;
  totalFundingRounds: number;
  highPotentialCount: number;
  averageScore: number;
}

@Injectable()
export class StartupsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: FindStartupsQueryDto): Promise<PaginatedStartupsResponse> {
    const { page = 1, limit = 10, sector, country, minScore, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.StartupWhereInput = {};

    if (sector) {
      where.sector = { equals: sector, mode: 'insensitive' };
    }

    if (country) {
      where.country = { equals: country, mode: 'insensitive' };
    }

    if (minScore !== undefined) {
      where.score = { gte: minScore };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sector: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.startup.count({ where }),
      this.prisma.startup.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ score: 'desc' }, { createdAt: 'desc' }],
        include: {
          fundingRound: {
            orderBy: { date: 'desc' },
          },
        },
      }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getMetrics(): Promise<DashboardMetricsResponse> {
    const [totalStartups, totalFundingRounds, highPotentialCount, scoreAggregate] =
      await Promise.all([
        this.prisma.startup.count(),
        this.prisma.fundingRound.count(),
        this.prisma.startup.count({
          where: { score: { gte: 7 } },
        }),
        this.prisma.startup.aggregate({
          _avg: { score: true },
        }),
      ]);

    return {
      totalStartups,
      totalFundingRounds,
      highPotentialCount,
      averageScore: scoreAggregate._avg.score
        ? Math.round(scoreAggregate._avg.score * 10) / 10
        : 0,
    };
  }

  async findOne(id: string) {
    const startup = await this.prisma.startup.findUnique({
      where: { id },
      include: {
        fundingRound: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!startup) {
      throw new NotFoundException(`Startup introuvable avec l'ID : ${id}`);
    }

    return startup;
  }

  async create(dto: CreateStartupDto) {
    return this.prisma.startup.create({
      data: dto,
      include: {
        fundingRound: true,
      },
    });
  }

  async update(id: string, dto: UpdateStartupDto) {
    await this.findOne(id);

    return this.prisma.startup.update({
      where: { id },
      data: dto,
      include: {
        fundingRound: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Supprimer d'abord les levées de fonds associées si nécessaire
    await this.prisma.fundingRound.deleteMany({
      where: { startupId: id },
    });

    return this.prisma.startup.delete({
      where: { id },
    });
  }
}
