import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { ApiLoggerService } from '../api-logger/api-logger.service';
import { CreateServiceRequestDto } from './dto/create';
import { JwtAuthGuard } from 'src/auth/guards/guard.jwt-auth';
import { Request } from 'express';
import { FindServicesRequestDto } from './dto/find';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}
  private readonly logger = new ApiLoggerService(ServiceController.name);

  @Get()
  @HttpCode(200)
  find(@Query() payload: FindServicesRequestDto) {
    this.logger.log(`Request for find`);
    return this.serviceService.find(payload);
  }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  create(@Body() payload: CreateServiceRequestDto, @Req() req: Request) {
    this.logger.log(`Request for Create`);
    return this.serviceService.create(payload, req['user']['id']);
  }
}
