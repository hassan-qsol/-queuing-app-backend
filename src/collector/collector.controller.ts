import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Get,
} from '@nestjs/common';
import { CollectorService } from './collector.service';
import { ApiLoggerService } from '../api-logger/api-logger.service';
import { JwtAuthGuard } from 'src/auth/guards/guard.jwt-auth';
import { LoginCollectorRequestDto } from './dto/login-collector';
import { LoginCollectorResponseDto } from './dto/login-collector/login-collector-res.dto';

@Controller('collectors')
export class CollectorController {
  constructor(private readonly collectorService: CollectorService) {}
  private readonly logger = new ApiLoggerService(CollectorController.name);

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  collectors() {
    this.logger.log(`Request for collectors GET`);
    return this.collectorService.findCollectors();
  }

  @Post()
  @HttpCode(200)
  loginCollector(
    @Body() loginDto: LoginCollectorRequestDto,
  ): Promise<LoginCollectorResponseDto> {
    this.logger.log(`Request for collectors POST  ${JSON.stringify(loginDto)} `);
    return this.collectorService.loginCollector(loginDto);
  }
}
