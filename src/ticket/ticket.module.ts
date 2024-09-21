import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { DatabaseModule } from 'src/database/database.module';
import PasswordHash from 'src/auth/password.hash';

@Module({
  imports: [DatabaseModule],
  controllers: [TicketController],
  providers: [TicketService, PasswordHash],
  exports: [TicketService],
})
export class TicketModule {}
