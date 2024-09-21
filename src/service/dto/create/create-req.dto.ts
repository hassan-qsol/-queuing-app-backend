import { IsString, IsNumber } from 'class-validator';

export class CreateServiceRequestDto {
  @IsString()
  serviceName: string;

  @IsString()
  serviceDescription: string;

  @IsNumber()
  companyId: number;
}
