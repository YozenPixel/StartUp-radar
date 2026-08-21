import { Test, TestingModule } from '@nestjs/testing';
import { WatchlistController } from './watchlist.controller';
import { WatchlistService } from './watchlist.service';

describe('WatchlistController', () => {
  let controller: WatchlistController;

  const mockWatchlistService = {
    findAllForUser: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    isWatchlisted: jest.fn(),
  };

  const mockUserReq = {
    user: { id: 'user-1', email: 'test@example.com' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchlistController],
      providers: [
        {
          provide: WatchlistService,
          useValue: mockWatchlistService,
        },
      ],
    }).compile();

    controller = module.get<WatchlistController>(WatchlistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get user watchlist', async () => {
    mockWatchlistService.findAllForUser.mockResolvedValue([{ id: 'st-1', name: 'AI Labs' }]);

    const result = await controller.findAll(mockUserReq);
    expect(result).toHaveLength(1);
    expect(mockWatchlistService.findAllForUser).toHaveBeenCalledWith('user-1');
  });

  it('should add startup to user watchlist', async () => {
    mockWatchlistService.add.mockResolvedValue({ id: 'wl-1', startupId: 'st-1' });

    const result = await controller.add(mockUserReq, 'st-1', { notes: 'Focus' });
    expect(result.startupId).toBe('st-1');
    expect(mockWatchlistService.add).toHaveBeenCalledWith('user-1', 'st-1', 'Focus');
  });

  it('should remove startup from user watchlist', async () => {
    mockWatchlistService.remove.mockResolvedValue({ success: true, startupId: 'st-1' });

    const result = await controller.remove(mockUserReq, 'st-1');
    expect(result.success).toBe(true);
    expect(mockWatchlistService.remove).toHaveBeenCalledWith('user-1', 'st-1');
  });

  it('should check if startup is in user watchlist', async () => {
    mockWatchlistService.isWatchlisted.mockResolvedValue({ isWatchlisted: true });

    const result = await controller.check(mockUserReq, 'st-1');
    expect(result.isWatchlisted).toBe(true);
    expect(mockWatchlistService.isWatchlisted).toHaveBeenCalledWith('user-1', 'st-1');
  });
});
