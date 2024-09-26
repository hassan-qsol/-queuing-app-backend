import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GenerateTicketRequestDto } from './dto/generate-ticket';
import { startOfDay, endOfDay } from 'date-fns';
import { ETicketStatus } from '@prisma/client';
import { ErrorUtil } from 'src/common/utils/errors.utils';
import { FindQueueRequestDto, FindQueueResponseDto } from './dto/find';
import { UpdateQueueRequestDto } from './dto/update';
import { TicketException } from 'src/common/exceptions/ticket.exception';

const today = new Date(),
  startOfToday = startOfDay(today),
  endOfToday = endOfDay(today);

@Injectable()
export class TicketService {
  constructor(private readonly db: DatabaseService) {}

  async generateTicket(
    payload: GenerateTicketRequestDto,
    createdBy: number,
  ): Promise<number> {
    const today = new Date();

    // Get the start and end of the current day
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    // Check if the collector already has a ticket for this service today
    const existingTicket = await this.db.tickets
      .findFirst({
        where: {
          service_id: payload.serviceId,
          collector_id: payload.collectorId,
          status: { not: 'COMPLETED' },
          created_at: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      })
      .catch((e) => {
        console.error(e.message);
        ErrorUtil.internalServerError(TicketException.unableToGetTicket());
      });

    // If the collector already has a ticket, return that ticket number
    if (existingTicket) return existingTicket.ticket_number;

    // Find the highest ticket_number for today's date and the given service_id
    const lastTicket = await this.db.tickets
      .findFirst({
        where: {
          service_id: payload.serviceId,
          created_at: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
        orderBy: { ticket_number: 'desc' },
      })
      .catch((e) => {
        console.error(e.message);
        ErrorUtil.internalServerError(TicketException.unableToGetLastTicket());
      });

    // Calculate the next ticket_number (start from 0 if no previous tickets for today)
    const nextTicketNumber = lastTicket ? lastTicket.ticket_number + 1 : 0;

    // Create the new ticket with the next ticket_number
    await this.db.tickets
      .create({
        data: {
          ticket_number: nextTicketNumber,
          service_id: payload.serviceId,
          collector_id: payload.collectorId,
          status: ETicketStatus.PENDING,
          created_by: createdBy,
        },
      })
      .catch((e) => {
        console.error(e.message);
        ErrorUtil.internalServerError(TicketException.unableToGenerateTicket());
      });

    return nextTicketNumber;
  }

  async find(
    { serviceId, companyId }: FindQueueRequestDto,
    userId: number,
  ): Promise<FindQueueResponseDto[]> {
    await this.checkManagerAuthority(companyId, userId);

    const tickets = await this.db.tickets
      .findMany({
        where: {
          service_id: serviceId,
          created_at: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
        include: {
          collector: {
            select: {
              id: true,
              cnic: true,
            },
          },
        },
        orderBy: {
          ticket_number: 'asc',
        },
      })
      .catch((e) => {
        console.error(e.message);
        ErrorUtil.internalServerError(TicketException.unableToGetTicketQueue());
      });
    if (!tickets.length) ErrorUtil.notFound(TicketException.queueNotFound());
    // Find the latest pending ticket
    const latestPendingTicket = tickets.find(
      (ticket) => ticket.status === 'PENDING' || ticket.status === 'PROCESS',
    );

    // Map the tickets and set myTurn based on the latest pending ticket
    return tickets.map((ticket) => ({
      id: ticket.id,
      collectorCNIC: ticket.collector.cnic,
      collectorId: ticket.collector.id,
      ticketNo: ticket.ticket_number,
      status: ticket.status,
      myTurn: latestPendingTicket && ticket.id === latestPendingTicket.id, // true for the latest pending ticket
    }));
  }

  async update(
    { ticketId, companyId, status }: UpdateQueueRequestDto,
    userId: number,
  ): Promise<string> {
    await this.checkManagerAuthority(companyId, userId);

    const payload = {
      status:
        status === ETicketStatus.PENDING // If not PENDING, mark as completed
          ? ETicketStatus.PROCESS
          : ETicketStatus.COMPLETED,
    };
    await this.db.tickets
      .update({
        where: { id: ticketId },
        data: payload,
      })
      .catch((e) => {
        console.error(e.message);
        ErrorUtil.internalServerError(TicketException.queueNotUpdated());
      });

    return 'Tickets queue updated.';
  }

  private async checkManagerAuthority(companyId: number, userId: number) {
    const company = await this.db.companies
      .findFirst({
        where: {
          id: companyId,
          company_manager: userId,
        },
      })
      .catch((e) => {
        console.error(e.message);
        ErrorUtil.internalServerError(TicketException.contactAdministration());
      });
    if (!company) throw new UnauthorizedException();
  }
}
