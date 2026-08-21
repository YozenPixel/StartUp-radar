import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WatchlistService {
  constructor(private prisma: PrismaService) {}

  async findAllForUser(userId: string) {
    const items = await this.prisma.watchlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        startup: {
          include: {
            fundingRound: {
              orderBy: { date: 'desc' },
            },
          },
        },
      },
    });

    return items.map((item) => ({
      ...item.startup,
      watchlistNotes: item.notes,
      watchlistedAt: item.createdAt,
    }));
  }

  async add(userId: string, startupId: string, notes?: string) {
    const startup = await this.prisma.startup.findUnique({
      where: { id: startupId },
    });

    if (!startup) {
      throw new NotFoundException(`Startup introuvable (ID: ${startupId})`);
    }

    return this.prisma.watchlistItem.upsert({
      where: {
        userId_startupId: {
          userId,
          startupId,
        },
      },
      create: {
        userId,
        startupId,
        notes,
      },
      update: {
        notes: notes !== undefined ? notes : undefined,
      },
      include: {
        startup: true,
      },
    });
  }

  async remove(userId: string, startupId: string) {
    await this.prisma.watchlistItem.deleteMany({
      where: {
        userId,
        startupId,
      },
    });

    return { success: true, startupId };
  }

  async isWatchlisted(userId: string, startupId: string) {
    const item = await this.prisma.watchlistItem.findUnique({
      where: {
        userId_startupId: {
          userId,
          startupId,
        },
      },
    });

    return { isWatchlisted: !!item };
  }
}
