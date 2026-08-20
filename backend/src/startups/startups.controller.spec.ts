import { Test, TestingModule } from '@nestjs/testing';
import { StartupsController } from './startups.controller';
import { StartupsService } from './startups.service';

describe('StartupsController', () => {
  let controller: StartupsController;

  const mockStartupsService = {
    findAll: jest.fn(),
    getMetrics: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StartupsController],
      providers: [{ provide: StartupsService, useValue: mockStartupsService }],
    }).compile();

    controller = module.get<StartupsController>(StartupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getMetrics', async () => {
    const metrics = { totalStartups: 10, totalFundingRounds: 5, highPotentialCount: 3, averageScore: 8 };
    mockStartupsService.getMetrics.mockResolvedValue(metrics);

    const result = await controller.getMetrics();
    expect(result).toEqual(metrics);
    expect(mockStartupsService.getMetrics).toHaveBeenCalled();
  });

  it('should call findAll with query', async () => {
    const query = { page: 1, limit: 10, search: 'AI' };
    const paginated = { data: [], total: 0, page: 1, limit: 10, totalPages: 1 };
    mockStartupsService.findAll.mockResolvedValue(paginated);

    const result = await controller.findAll(query);
    expect(result).toEqual(paginated);
    expect(mockStartupsService.findAll).toHaveBeenCalledWith(query);
  });
});
