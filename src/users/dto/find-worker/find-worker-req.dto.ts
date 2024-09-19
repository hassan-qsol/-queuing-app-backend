import { IsNumber } from 'class-validator';

export class findWorkerRequestDto {
  @IsNumber()
  user_id: number;
}
