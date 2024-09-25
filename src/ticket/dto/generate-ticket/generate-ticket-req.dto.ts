import { IsNumber } from 'class-validator';

export class GenerateTicketRequestDto {
  @IsNumber()
  collectorId: number;

  @IsNumber()
  serviceId: number;
}
