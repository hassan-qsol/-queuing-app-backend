import { Module } from '@nestjs/common';
import { CollectorService } from './collector.service';
import { CollectorController as CollectorController } from './collector.controller';
import { DatabaseModule } from 'src/database/database.module';
import PasswordHash from 'src/auth/password.hash';

@Module({
  imports: [DatabaseModule],
  controllers: [CollectorController],
  providers: [CollectorService, PasswordHash],
  exports: [CollectorService],
})
export class CollectorModule {}
