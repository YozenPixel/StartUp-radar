import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException } from '@nestjs/common';

describe('HealthController', () => {
  let controller: HealthController;

  const mockPrismaService = {
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return status ok when database is healthy', async () => {
    mockPrismaService.$queryRaw.mockResolvedValue([{ 1: 1 }]);

    const result = await controller.check();
    expect(result.status).toBe('ok');
    expect(result.services.database.status).toBe('healthy');
  });

  it('should throw HttpException with status 503 when database is unreachable', async () => {
    mockPrismaService.$queryRaw.mockRejectedValue(new Error('Connection failed'));

    await expect(controller.check()).rejects.toThrow(HttpException);
  });
});
