import { EUserType } from "@prisma/client";

export class LoginCollectorResponseDto {
  id: number;
  userType: EUserType;
  cnic: string;
  accessToken: string;
}
