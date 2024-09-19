import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  private readonly maxRetryAttempts = 10; // Maximum number of retry attempts
  private readonly retryDelay = 10000; // Delay in milliseconds between retry attempts
  private currentRetryAttempt = 0;

  async onModuleInit() {
    await this.connectWithRetry();
  }

  private async connectWithRetry() {
    try {
      await this.$connect();
      this.currentRetryAttempt = 0;
      console.info('Database connected');
    } catch (error) {
      console.error('Error connecting to database:', error);
      if (this.currentRetryAttempt < this.maxRetryAttempts) {
        this.currentRetryAttempt++;
        console.info(
          `Retry attempt ${this.currentRetryAttempt} in ${this.retryDelay / 1000} seconds...`,
        );
        setTimeout(() => this.connectWithRetry(), this.retryDelay);
      } else {
        console.error(
          `Max retry attempts (${this.maxRetryAttempts}) reached. Could not connect to database.`,
        );
        throw error; // Ensure application fails to start if max retries exceeded
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.info('Database disconnected');
  }
}
