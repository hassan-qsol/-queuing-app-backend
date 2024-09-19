import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { LoginInputDto } from './dto/login-input.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import PasswordHash from '../auth/password.hash';
import { ErrorUtil } from '../common/utils/error-util';
import { CreateUserResponseDto } from './dto/create';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: DatabaseService,
    private jwtService: JwtService,
    private readonly passwordHash: PasswordHash,
  ) {}

  async create(payload: CreateUserResponseDto): Promise<string> {
    console.log(payload)
    return '';
  }
  async login(payload: LoginInputDto): Promise<LoginDto> {
    const user = await this.db.users.findFirst({
      where: { user_name: payload.userName },
    });
    if (!user)
      ErrorUtil.notFound(`No user found for user name: ${payload.userName}`);

     
    const isPasswordValid = this.passwordHash.CheckPassword(
      payload?.password,
      user?.password,
    ); //user.password === loginInputDto.password;

    // If password does not match, throw an error
    if (!isPasswordValid) {
      ErrorUtil.unauthorized('Invalid password');
    }

    // Step 3: Generate a JWT containing the user's ID and return it
    const accessToken = this.jwtService.sign({
      user_id: user.id,
    });

    // delete password key from object
    delete user.password;

    return {
      id: user.id,
      fullName: user.first_name+" "+user.last_name,
      userName: user.user_name,
      email: user.email,
      userType: user.user_type,
      accessToken: accessToken,
    };
  }

  async findAuthoizedUser(user_id: string) {
    const result = await this.db.$queryRaw`
    SELECT 
    md5(u.id) AS user_id,      -- Select the MD5 hashed user ID
    u.user_name,  
    u.email, 
    u.full_name, 
    u.created_by, 
    ur.name AS role,
    ur.id AS role_id
FROM 
    lms_hazwoper.user u
INNER JOIN 
    user_role AS ur
ON 
    ur.id = u.user_role_id 
WHERE 
    md5(u.id) = ${user_id} 
    AND u.is_deleted = 0;
  `;
    return result;
  }

  async logout(request) {
    request?.session?.destroy(() => {
      return {
        message: 'Logout successful',
        statusCode: 200,
      };
    });
  }
}
