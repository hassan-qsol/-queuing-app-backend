import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { ApiLoggerService } from '../api-logger/api-logger.service';
import { GetTicketRequestDto } from './dto/get-ticket';
import { JwtAuthGuard } from 'src/auth/guards/guard.jwt-auth';
import { Request } from 'express';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}
  private readonly logger = new ApiLoggerService(TicketController.name);

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  getTicket(@Body() payload: GetTicketRequestDto, @Req() req: Request) {
    this.logger.log(`Request for Create`);
    return this.ticketService.getTicket(payload, req['user']['id']);
  }
}
