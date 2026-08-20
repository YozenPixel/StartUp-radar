import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a new user', async () => {
    const dto = { email: 'new@example.com', password: 'password123' };
    mockUsersService.create.mockResolvedValue({ id: 'uuid-1', email: dto.email });

    const result = await controller.register(dto);
    expect(result).toEqual({ id: 'uuid-1', email: dto.email });
    expect(mockUsersService.create).toHaveBeenCalledWith(dto);
  });

  it('should login an existing user', async () => {
    const dto = { email: 'user@example.com', password: 'password123' };
    const validatedUser = { id: 'uuid-1', email: dto.email };
    mockAuthService.validateUser.mockResolvedValue(validatedUser);
    mockAuthService.login.mockResolvedValue({ access_token: 'token-xyz' });

    const result = await controller.login(dto);
    expect(result).toEqual({ access_token: 'token-xyz' });
  });

  it('should throw UnauthorizedException when invalid credentials', async () => {
    const dto = { email: 'wrong@example.com', password: 'wrong' };
    mockAuthService.validateUser.mockResolvedValue(null);

    await expect(controller.login(dto)).rejects.toThrow(UnauthorizedException);
  });
});
