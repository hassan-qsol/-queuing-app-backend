import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import PasswordHash from 'src/auth/password.hash';
import { LoginInputDto } from './dto/login/login-req.dto';
import { LoginDto } from './dto/login/login-res.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

jest.mock('src/database/database.service');
jest.mock('@nestjs/jwt');
jest.mock('src/auth/password.hash');

describe('UsersService', () => {
  let service: UsersService;
  let db: jest.Mocked<DatabaseService>;
  let jwtService: jest.Mocked<JwtService>;
  let passwordHash: jest.Mocked<PasswordHash>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, DatabaseService, JwtService, PasswordHash],
    }).compile();

    service = module.get<UsersService>(UsersService);
    db = module.get(DatabaseService);
    jwtService = module.get(JwtService);
    passwordHash = module.get(PasswordHash);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should log in and return user details with an access token', async () => {
      const loginDto: LoginInputDto = {
        user_name: 'testuser',
        password: 'testpassword',
      };

      const userMock = [
        {
          id: 1,
          user_id: 'somehashedid',
          user_name: 'testuser',
          email: 'test@example.com',
          full_name: 'Test User',
          password: 'hashedpassword',
          role: 'user',
        },
      ];

      db.$queryRaw.mockResolvedValue(userMock);
      passwordHash.CheckPassword.mockReturnValue(true);
      jwtService.sign.mockReturnValue('test-token');

      const expectedResult: LoginDto = {
        id: 1,
        user_id: '',
        created_by: 1,
        password: '',
        user_name: 'testuser',
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'user',
        access_token: 'test-token',
      };

      const result = await service.loginUser(loginDto);

      expect(result).toEqual(expectedResult);
      expect(db.$queryRaw).toHaveBeenCalledWith(expect.anything());
      expect(passwordHash.CheckPassword).toHaveBeenCalledWith(
        'testpassword',
        'hashedpassword',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({ user_id: 'somehashedid' });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const loginDto: LoginInputDto = {
        user_name: 'nonexistent',
        password: 'testpassword',
      };

      db.$queryRaw.mockResolvedValue([]);

      await expect(service.loginUser(loginDto)).rejects.toThrow(NotFoundException);
      expect(db.$queryRaw).toHaveBeenCalledWith(expect.anything());
      expect(passwordHash.CheckPassword).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginDto: LoginInputDto = {
        user_name: 'testuser',
        password: 'wrongpassword',
      };

      const userMock = [
        {
          id: 1,
          user_id: 'somehashedid',
          user_name: 'testuser',
          email: 'test@example.com',
          full_name: 'Test User',
          password: 'hashedpassword',
          role: 'user',
        },
      ];

      db.$queryRaw.mockResolvedValue(userMock);
      passwordHash.CheckPassword.mockReturnValue(false);

      await expect(service.loginUser(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(db.$queryRaw).toHaveBeenCalledWith(expect.anything());
      expect(passwordHash.CheckPassword).toHaveBeenCalledWith(
        'wrongpassword',
        'hashedpassword',
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});
