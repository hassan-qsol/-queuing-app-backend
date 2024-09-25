import { ETicketStatus } from '@prisma/client';

export class FindQueueResponseDto {
  ticketNo: number;
  collectorId: number;
  collectorCNIC: string;
  status: ETicketStatus;
  myTurn: boolean;
}
