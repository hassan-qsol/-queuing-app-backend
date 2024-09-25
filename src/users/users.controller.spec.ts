import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LoginInputDto } from './dto/login/login-req.dto';
import { Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';
import PasswordHash from '../auth/password.hash';

// Mock JWT configuration with a valid secret key
const mockJwtService = {
  sign: (_) => {
    console.log('MY Payload', _);
    return 'mock-jwt-token';
  },
};

describe('UsersController (Integration)', () => {
  let controller: UsersController;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        DatabaseService,
        {
          provide: JwtService,
          useValue: mockJwtService, // Provide the mock JWT service
        },
        PasswordHash,
        Logger,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);

    // Ensure database connection is established before tests run
    await module.get<DatabaseService>(DatabaseService).onModuleInit();
  });

  afterAll(async () => {
    // Clean up resources, such as closing database connections
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should log in and return user details with an access token', async () => {
      // Seed test data or use existing data in the database
      const loginDto: LoginInputDto = {
        user_name: 'talhahori1',
        password: '1234567890',
      };

      // Perform the actual login operation
      const result = await controller.login(loginDto);

      // Assert that the result matches the expected structure
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('user_id');
      expect(result).toHaveProperty('user_name');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('full_name');
      expect(result).toHaveProperty('created_by');
      expect(result).toHaveProperty('password');
      expect(result).toHaveProperty('role');
      expect(result).toHaveProperty('access_token');
    });
  });
});
