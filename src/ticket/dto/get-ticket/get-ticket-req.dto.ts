import { IsString, IsNumber } from 'class-validator';

export class GetTicketRequestDto {
  @IsString()
  collectorName: string;

  @IsNumber()
  serviceId: number;

  @IsNumber()
  companyId: number;
}
