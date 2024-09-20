import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { DatabaseModule } from 'src/database/database.module';
import PasswordHash from 'src/auth/password.hash';
// import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule],
  controllers: [CompanyController],
  providers: [CompanyService, PasswordHash],
  exports: [CompanyService],
})
export class CompanyModule {}
