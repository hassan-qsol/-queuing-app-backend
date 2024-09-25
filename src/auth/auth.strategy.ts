import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `${process.env.JWT_SECRET}`,
    });
  }

  async validate(payload: { user_id?: string; collector_id?: string }) {
    const isCollector = payload?.collector_id ? true : false;
    const data = {
      isCollector: isCollector,
      id: isCollector ? Number(payload.collector_id) : Number(payload.user_id),
    };
    const persona = await this.usersService.findAuthorizedPersona(data);
    if (!persona) throw new UnauthorizedException();

    return persona; // Return the user so it can be accessed in the controller
  }
}
