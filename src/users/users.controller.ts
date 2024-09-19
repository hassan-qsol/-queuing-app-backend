import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiLoggerService } from '../api-logger/api-logger.service';
import { LoginInputDto } from './dto/login-input.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../auth/guards/guard.jwt-auth';
import { CreateUserResponseDto } from './dto/create';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new ApiLoggerService(UsersController.name);

  @Post()
  @HttpCode(200)
  create(@Body() payload: CreateUserResponseDto) {
    this.logger.log(`Request for users create: ${JSON.stringify(payload)} `);
    return this.usersService.create(payload);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: LoginInputDto): Promise<LoginDto> {
    this.logger.log(`Request for login ${JSON.stringify(loginDto)} `);
    return this.usersService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() request: Request) {
    this.logger.log(`Request for logout`);
    return this.usersService.logout(request);
  }
  Z;
}
