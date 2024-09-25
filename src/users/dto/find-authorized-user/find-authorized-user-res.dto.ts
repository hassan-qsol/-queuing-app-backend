import { EUserType } from '@prisma/client';

export type TUserAuthorized = {
  id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: EUserType;
  created_by: number | null;
};
export type TCollectorAuthorized = {
  id: number;
  cnic: string;
};
export class findAuthorizedPersonaResponseDto {
  isCollector: boolean;
  user: TUserAuthorized;
  collector: TCollectorAuthorized;
}
