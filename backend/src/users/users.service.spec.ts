import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user and not return password', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);
    mockPrismaService.user.create.mockResolvedValue({
      id: 'uuid-123',
      email: 'test@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.create({ email: 'test@example.com', password: 'plain-password' });
    expect(result.email).toBe('test@example.com');
    expect((result as any).password).toBeUndefined();
    expect(mockPrismaService.user.create).toHaveBeenCalled();
  });

  it('should throw ConflictException if user already exists', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'existing-id',
      email: 'existing@example.com',
    });

    await expect(
      service.create({ email: 'existing@example.com', password: 'password123' }),
    ).rejects.toThrow(ConflictException);
  });
});
