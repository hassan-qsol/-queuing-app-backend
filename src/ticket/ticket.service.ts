import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GetTicketRequestDto } from './dto/get-ticket';

@Injectable()
export class TicketService {
  constructor(private readonly db: DatabaseService) {}

  async getTicket(
    payload: GetTicketRequestDto,
    createdBy: number,
  ): Promise<number> {
    console.log(createdBy)
    console.log(payload)

    return 99 // ticket number
  }
}
