import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import PasswordHash from 'src/auth/password.hash';
// import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, PasswordHash],
  exports: [UsersService],
})
export class UsersModule {}
