import { IsNumber } from "class-validator";

export class FindServicesRequestDto {
  @IsNumber()
  companyId: number;
}
