import { Test, TestingModule } from '@nestjs/testing';
import { WatchlistService } from './watchlist.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('WatchlistService', () => {
  let service: WatchlistService;

  const mockPrismaService = {
    startup: {
      findUnique: jest.fn(),
    },
    watchlistItem: {
      findMany: jest.fn(),
      upsert: jest.fn(),
      deleteMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchlistService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<WatchlistService>(WatchlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all watchlisted startups for a user', async () => {
    const mockItems = [
      {
        id: 'wl-1',
        notes: 'Important target',
        createdAt: new Date(),
        startup: {
          id: 'st-1',
          name: 'AI Labs',
          sector: 'AI',
          country: 'France',
          fundingRound: [],
        },
      },
    ];
    mockPrismaService.watchlistItem.findMany.mockResolvedValue(mockItems);

    const result = await service.findAllForUser('user-1');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('AI Labs');
    expect(result[0].watchlistNotes).toBe('Important target');
  });

  it('should add a startup to the user watchlist', async () => {
    mockPrismaService.startup.findUnique.mockResolvedValue({ id: 'st-1', name: 'AI Labs' });
    mockPrismaService.watchlistItem.upsert.mockResolvedValue({
      id: 'wl-1',
      userId: 'user-1',
      startupId: 'st-1',
      notes: 'Priority',
      startup: { id: 'st-1', name: 'AI Labs' },
    });

    const result = await service.add('user-1', 'st-1', 'Priority');
    expect(result.startupId).toBe('st-1');
    expect(mockPrismaService.watchlistItem.upsert).toHaveBeenCalled();
  });

  it('should throw NotFoundException when adding a non-existent startup', async () => {
    mockPrismaService.startup.findUnique.mockResolvedValue(null);

    await expect(service.add('user-1', 'invalid-id')).rejects.toThrow(NotFoundException);
  });

  it('should remove a startup from the watchlist', async () => {
    mockPrismaService.watchlistItem.deleteMany.mockResolvedValue({ count: 1 });

    const result = await service.remove('user-1', 'st-1');
    expect(result).toEqual({ success: true, startupId: 'st-1' });
    expect(mockPrismaService.watchlistItem.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', startupId: 'st-1' },
    });
  });

  it('should check if a startup is watchlisted', async () => {
    mockPrismaService.watchlistItem.findUnique.mockResolvedValue({ id: 'wl-1' });

    const result = await service.isWatchlisted('user-1', 'st-1');
    expect(result).toEqual({ isWatchlisted: true });
  });
});
