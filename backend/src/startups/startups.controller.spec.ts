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
    getSignals: jest.fn(),
    createSignal: jest.fn(),
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

  it('should get signals for a startup', async () => {
    mockStartupsService.getSignals.mockResolvedValue([{ id: 'sig-1', type: 'HIRING_SURGE' }]);

    const result = await controller.getSignals('uuid-1');
    expect(result).toHaveLength(1);
    expect(mockStartupsService.getSignals).toHaveBeenCalledWith('uuid-1');
  });

  it('should create a market signal for a startup', async () => {
    const dto = { type: 'HIRING_SURGE', description: 'Tech hiring', confidenceScore: 0.9 };
    mockStartupsService.createSignal.mockResolvedValue({ id: 'sig-1', ...dto });

    const result = await controller.createSignal('uuid-1', dto);
    expect(result.id).toBe('sig-1');
    expect(mockStartupsService.createSignal).toHaveBeenCalledWith('uuid-1', dto);
  });
});
