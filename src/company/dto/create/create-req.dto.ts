// create-company.dto.ts
import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateCompanyRequestDto {
  @IsString()
  companyName: string;

  @IsNumber()
  companyManager: number;

  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;
}
