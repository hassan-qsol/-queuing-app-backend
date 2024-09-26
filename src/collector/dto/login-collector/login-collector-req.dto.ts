import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginCollectorRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(6)
  cnic: string;
}
