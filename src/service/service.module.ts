import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { DatabaseModule } from 'src/database/database.module';
import PasswordHash from 'src/auth/password.hash';
// import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule],
  controllers: [ServiceController],
  providers: [ServiceService, PasswordHash],
  exports: [ServiceService],
})
export class ServiceModule {}
