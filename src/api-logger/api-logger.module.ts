import { Module } from '@nestjs/common';
import { ApiLoggerService } from './api-logger.service';

@Module({
  providers: [ApiLoggerService],
  exports: [ApiLoggerService],
})
export class ApiLoggerModule {}
