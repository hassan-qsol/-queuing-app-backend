import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiLoggerService } from '../api-logger/api-logger.service';
import { LoginInputDto } from './dto/login/login-req.dto';
import { LoginDto } from './dto/login/login-res.dto';
import { JwtAuthGuard } from '../auth/guards/guard.jwt-auth';
import { CreateUserRequestDto } from './dto/create';
import { Request } from 'express';
import { LoginCollectorRequestDto } from './dto/login-collector';
import { LoginCollectorResponseDto } from './dto/login-collector/login-collector-res.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new ApiLoggerService(UsersController.name);

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  create(@Body() payload: CreateUserRequestDto, @Req() req: Request) {
    this.logger.log(`Request for users create: ${JSON.stringify(payload)} `);
    console.log(req);
    return this.usersService.create(payload, req['user']['user']['id']);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  find() {
    this.logger.log(`Request for users/find`);
    return this.usersService.find();
  }

  @Get('collectors')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  collectors() {
    this.logger.log(`Request for users/collectors`);
    return this.usersService.findCollectors();
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: LoginInputDto): Promise<LoginDto> {
    this.logger.log(`Request for login ${JSON.stringify(loginDto)} `);
    return this.usersService.loginUser(loginDto);
  }

  @Post('login-collector')
  @HttpCode(200)
  loginCollector(
    @Body() loginDto: LoginCollectorRequestDto,
  ): Promise<LoginCollectorResponseDto> {
    this.logger.log(`Request for login collector ${JSON.stringify(loginDto)} `);
    return this.usersService.loginCollector(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() request: Request) {
    this.logger.log(`Request for logout`);
    return this.usersService.logout(request);
  }
  Z;
}
