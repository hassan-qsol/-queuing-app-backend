import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindQueueRequestDto {
  @Transform(({ value }) => parseInt(value, 10)) // Transform string to number
  @IsNumber({}, { message: 'companyId must be a valid number' }) // Ensures the value is a number
  companyId: number;

  @Transform(({ value }) => parseInt(value, 10)) // Transform string to number
  @IsNumber({}, { message: 'serviceId must be a valid number' }) // Ensures the value is a number
  serviceId: number;
}
