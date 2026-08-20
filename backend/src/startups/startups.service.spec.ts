import { Test, TestingModule } from '@nestjs/testing';
import { StartupsService } from './startups.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('StartupsService', () => {
  let service: StartupsService;

  const mockPrismaService = {
    startup: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      aggregate: jest.fn(),
    },
    fundingRound: {
      count: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StartupsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<StartupsService>(StartupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated startups', async () => {
    const mockData = [
      { id: '1', name: 'Alpha AI', sector: 'AI', country: 'USA', size: '1-10', score: 9 },
    ];
    mockPrismaService.startup.count.mockResolvedValue(1);
    mockPrismaService.startup.findMany.mockResolvedValue(mockData);

    const result = await service.findAll({ page: 1, limit: 10, sector: 'AI' });
    expect(result.data).toEqual(mockData);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it('should return dashboard metrics', async () => {
    mockPrismaService.startup.count
      .mockResolvedValueOnce(50) // totalStartups
      .mockResolvedValueOnce(15); // highPotentialCount
    mockPrismaService.fundingRound.count.mockResolvedValue(20);
    mockPrismaService.startup.aggregate.mockResolvedValue({
      _avg: { score: 7.84 },
    });

    const metrics = await service.getMetrics();
    expect(metrics).toEqual({
      totalStartups: 50,
      totalFundingRounds: 20,
      highPotentialCount: 15,
      averageScore: 7.8,
    });
  });

  it('should return a single startup by id', async () => {
    const mockStartup = { id: 'uuid-1', name: 'Alpha AI' };
    mockPrismaService.startup.findUnique.mockResolvedValue(mockStartup);

    const result = await service.findOne('uuid-1');
    expect(result).toEqual(mockStartup);
  });

  it('should throw NotFoundException when startup not found', async () => {
    mockPrismaService.startup.findUnique.mockResolvedValue(null);

    await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
  });
});
