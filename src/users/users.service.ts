import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { LoginInputDto } from './dto/login-input.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import PasswordHash from '../auth/password.hash';
import { ErrorUtil } from '../common/utils/error-util';
import { CreateUserRequestDto } from './dto/create';
import {
  findAuthorizedUserRequestDto,
  findAuthorizedPersonaResponseDto,
} from './dto/find-authorized-user';
import { FindUsersResponseDto } from './dto/find';
import { FindCollectorsResponseDto } from './dto/collectors';
import { LoginCollectorRequestDto } from './dto/login-collector';
import { EUserType } from '@prisma/client';
import { LoginCollectorResponseDto } from './dto/login-collector/login-collector-res.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: DatabaseService,
    private jwtService: JwtService,
    private readonly passwordHash: PasswordHash,
  ) {}

  async create(
    payload: CreateUserRequestDto,
    createdBy: number,
  ): Promise<string> {
    await this.db.users
      .create({ data: { ...payload, created_by: createdBy } })
      .catch((e) => {
        console.error(e);
        ErrorUtil.internalServerError('Unable to add manager user');
      });

    return 'Manager added successfully';
  }

  async find(): Promise<FindUsersResponseDto[]> {
    const users = await this.db.users
      .findMany({
        where: { user_type: 'MANAGER' },
        select: { id: true, first_name: true, last_name: true },
      })
      .catch((e) => {
        console.error(e);
        ErrorUtil.internalServerError('Unable to find managers');
      });
    if (!users.length) ErrorUtil.notFound('Managers not found.');

    return users.map((user) => ({
      id: String(user.id),
      name: user.first_name + ' ' + user.last_name,
    }));
  }

  async findCollectors(): Promise<FindCollectorsResponseDto[]> {
    const collectors = await this.db.collectors
      .findMany({
        where: { is_deleted: false },
        select: { id: true, cnic: true },
      })
      .catch((e) => {
        console.error(e);
        ErrorUtil.internalServerError('Unable to find collectors');
      });
    if (!collectors.length) ErrorUtil.notFound('Collectors not found.');

    return collectors.map((collector) => ({
      id: String(collector.id),
      cnic: collector.cnic,
    }));
  }

  async loginUser(payload: LoginInputDto): Promise<LoginDto> {
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
      fullName: user.first_name + ' ' + user.last_name,
      userName: user.user_name,
      email: user.email,
      userType: user.user_type,
      accessToken: accessToken,
    };
  }

  async loginCollector(
    payload: LoginCollectorRequestDto,
  ): Promise<LoginCollectorResponseDto> {
    const collector = await this.db.collectors.findFirst({
      where: { cnic: payload.cnic },
    });
    if (!collector)
      ErrorUtil.notFound(`No collector found for CNIC: ${payload.cnic}`);

    const accessToken = this.jwtService.sign({
      collector_id: collector.id,
    });

    return {
      id: collector.id,
      userType: EUserType.CUSTOMER,
      cnic: collector.cnic,
      accessToken: accessToken,
    };
  }

  async findAuthorizedPersona(
    data: findAuthorizedUserRequestDto,
  ): Promise<findAuthorizedPersonaResponseDto | null> {
    const result: findAuthorizedPersonaResponseDto = {
      isCollector: data.isCollector,
      collector: { id: 0, cnic: '' },
      user: {
        id: 0,
        user_name: '',
        first_name: '',
        last_name: '',
        email: '',
        user_type: EUserType.CUSTOMER,
        created_by: null,
      },
    };
    if (data.isCollector) {
      const collector = await this.db.collectors.findFirst({
        where: { id: data.id },
      });
      if (collector) {
        result.isCollector = true;
        result.collector = collector;
        return result;
      }
    } else {
      const user = await this.db.users.findFirst({
        where: { id: data.id },
      });
      if (user) {
        result.isCollector = true;
        result.user = user;
        return result;
      }
    }

    if (result.collector.id === 0 && result.user.id === 0) return null;
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
