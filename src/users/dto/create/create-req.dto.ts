import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserRequestDto {
  @IsString()
  @Length(1, 255)
  user_name: string;

  @IsOptional()
  @IsString()
  @Length(0, 55)
  first_name?: string;

  @IsOptional()
  @IsString()
  @Length(0, 55)
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(0, 55)
  phone?: string;

  @IsString()
  @Length(1, 100)
  password: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  reset_token?: string;

  @IsOptional()
  @IsString()
  picture?: string;
}
