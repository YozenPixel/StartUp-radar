import { Test, TestingModule } from '@nestjs/testing';
import { FundingRoundsService } from './funding-rounds.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('FundingRoundsService', () => {
  let service: FundingRoundsService;

  const mockPrismaService = {
    fundingRound: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    startup: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FundingRoundsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FundingRoundsService>(FundingRoundsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should list all funding rounds', async () => {
    const mockRounds = [{ id: '1', amount: 5000000, startupId: 's-1' }];
    mockPrismaService.fundingRound.findMany.mockResolvedValue(mockRounds);

    const result = await service.findAll();
    expect(result).toEqual(mockRounds);
    expect(mockPrismaService.fundingRound.findMany).toHaveBeenCalled();
  });

  it('should throw NotFoundException on create if startup does not exist', async () => {
    mockPrismaService.startup.findUnique.mockResolvedValue(null);

    await expect(
      service.create({
        startupId: 'non-existent',
        amount: 1000000,
        date: '2026-01-01T00:00:00.000Z',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should create funding round if startup exists', async () => {
    const dto = {
      startupId: 'startup-1',
      amount: 2000000,
      date: '2026-01-01T00:00:00.000Z',
    };
    mockPrismaService.startup.findUnique.mockResolvedValue({ id: dto.startupId });
    mockPrismaService.fundingRound.create.mockResolvedValue({ id: 'round-1', ...dto });

    const result = await service.create(dto);
    expect(result).toEqual(expect.objectContaining({ id: 'round-1' }));
  });
});
