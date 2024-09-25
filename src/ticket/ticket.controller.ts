import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Req,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { ApiLoggerService } from '../api-logger/api-logger.service';
import { GenerateTicketRequestDto } from './dto/generate-ticket';
import { JwtAuthGuard } from 'src/auth/guards/guard.jwt-auth';
import { Request } from 'express';
import { FindQueueRequestDto } from './dto/find';
import { UpdateQueueRequestDto } from './dto/update';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}
  private readonly logger = new ApiLoggerService(TicketController.name);

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  generateTicket(
    @Body() payload: GenerateTicketRequestDto,
    @Req() req: Request,
  ) {
    this.logger.log(`Request for Create`);
    return this.ticketService.generateTicket(
      payload,
      req['user']['collector']['id'],
    );
  }

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  find(@Query() payload: FindQueueRequestDto, @Req() req: Request) {
    this.logger.log(`Request for tickets find`);
    return this.ticketService.find(payload, req['user']['user']['id']);
  }

  @Patch()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  update(@Body() payload: UpdateQueueRequestDto, @Req() req: Request) {
    this.logger.log(`Request for tickets Update`);
    return this.ticketService.update(payload, req['user']['user']['id']);
  }
}
