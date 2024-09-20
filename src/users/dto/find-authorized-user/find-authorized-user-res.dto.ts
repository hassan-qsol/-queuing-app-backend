import { EUserType } from '@prisma/client';

export class findAuthorizedUserResponseDto {
  id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  reset_token: string | null;
  user_type: EUserType;
  last_login: Date;
  picture: string | null;
  created_by: number | null;
}
