import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginInputDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
