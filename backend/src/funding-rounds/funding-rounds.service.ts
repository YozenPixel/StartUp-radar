import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFundingRoundDto } from './dto/create-funding-round.dto';

@Injectable()
export class FundingRoundsService {
  constructor(private prisma: PrismaService) {}

  async findAll(startupId?: string) {
    const where = startupId ? { startupId } : {};

    return this.prisma.fundingRound.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        startup: {
          select: {
            id: true,
            name: true,
            sector: true,
            country: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const round = await this.prisma.fundingRound.findUnique({
      where: { id },
      include: { startup: true },
    });

    if (!round) {
      throw new NotFoundException(`Tour de financement introuvable (ID: ${id})`);
    }

    return round;
  }

  async create(dto: CreateFundingRoundDto) {
    // Vérifier l'existence de la startup
    const startup = await this.prisma.startup.findUnique({
      where: { id: dto.startupId },
    });

    if (!startup) {
      throw new NotFoundException(`Startup introuvable (ID: ${dto.startupId})`);
    }

    return this.prisma.fundingRound.create({
      data: {
        startupId: dto.startupId,
        amount: dto.amount,
        date: new Date(dto.date),
      },
      include: { startup: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.fundingRound.delete({
      where: { id },
    });
  }
}
