import { IsNumber, IsBoolean } from 'class-validator';

export class ModifyMakeAdminRequestDto {
  @IsNumber()
  user_id: number;

  @IsBoolean()
  makeAdmin: boolean;
}
