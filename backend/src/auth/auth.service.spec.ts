import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a token and user session upon login', async () => {
    const user = { email: 'test@example.com', id: 'user-uuid', name: 'Alex', role: 'ANALYST' };
    const result = await service.login(user);
    expect(result).toEqual({
      access_token: 'mock-jwt-token',
      user: {
        id: 'user-uuid',
        email: 'test@example.com',
        name: 'Alex',
        role: 'ANALYST',
      },
    });
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      email: 'test@example.com',
      sub: 'user-uuid',
      role: 'ANALYST',
      name: 'Alex',
    });
  });
});
