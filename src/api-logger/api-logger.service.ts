import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Injectable()
export class ApiLoggerService extends ConsoleLogger {
  async logFile(entry) {
    const formattedEntry = `${Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Chicago' }).format(new Date())}\t${entry}\n`;
    try {
      if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
        await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'));
      }
      const dt = new Date();
      const currentDate = dt.toLocaleDateString().replace(/\//gi, '');
      await fsPromises.appendFile(
        path.join(__dirname, '..', '..', 'logs', `log-${currentDate}.log`),
        formattedEntry,
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  }

  log(message: unknown, context?: string) {
    const entry = `${this.context}\t${message}`;
    this.logFile(entry);
    super.log(message, context);
  }

  error(message: unknown, context?: string) {
    const entry = `${this.context}\t${message}`;
    this.logFile(entry);
    super.error(message, context);
  }
}
