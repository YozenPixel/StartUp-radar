import { Test, TestingModule } from '@nestjs/testing';
import { FundingRoundsController } from './funding-rounds.controller';
import { FundingRoundsService } from './funding-rounds.service';

describe('FundingRoundsController', () => {
  let controller: FundingRoundsController;

  const mockFundingRoundsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FundingRoundsController],
      providers: [
        {
          provide: FundingRoundsService,
          useValue: mockFundingRoundsService,
        },
      ],
    }).compile();

    controller = module.get<FundingRoundsController>(FundingRoundsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should list funding rounds with optional filter', async () => {
    mockFundingRoundsService.findAll.mockResolvedValue([]);
    await controller.findAll('s-123');
    expect(mockFundingRoundsService.findAll).toHaveBeenCalledWith('s-123');
  });
});
