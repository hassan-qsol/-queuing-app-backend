import { IsNumber, IsEnum } from 'class-validator';
import { ETicketStatus } from '@prisma/client'; // Import the enum from the Prisma client

export class UpdateQueueRequestDto {
  @IsNumber()
  companyId: number;

  @IsNumber()
  ticketId: number;

  @IsEnum(ETicketStatus) // Validate that the status is one of the enum values
  status: ETicketStatus;
}
