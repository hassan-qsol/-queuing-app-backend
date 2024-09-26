export class TicketException {
  // Generic
  static contactAdministration(): string {
    return `Something went wrong! Please contact administration.`;
  }

  // APIs
  static ticketsNotFound(): string {
    return `Tickets not found.`;
  }
  static unableToGetTicket(): string {
    return `Unable to get existing ticket.`;
  }
  static unableToGetLastTicket(): string {
    return `Unable to get last ticket.`;
  }
  static unableToGenerateTicket(): string {
    return `Unable to generate ticket.`;
  }
  static unableToGetTicketQueue(): string {
    return `Unable to get tickets queue.`;
  }
  static queueNotFound(): string {
    return `Tickets queue not found.`;
  }
  static queueNotUpdated(): string {
    return `Unable to update tickets queue.`;
  }
}
