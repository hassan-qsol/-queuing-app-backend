import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { ApiLoggerService } from '../api-logger/api-logger.service';
import { CreateCompanyResponseDto } from './dto/create';
import { JwtAuthGuard } from 'src/auth/guards/guard.jwt-auth';
import { Request } from 'express';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}
  private readonly logger = new ApiLoggerService(CompanyController.name);
  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  create(@Body() payload: CreateCompanyResponseDto, @Req() req: Request) {
    return this.companyService.create(payload, req['user']['id']);
  }
}
