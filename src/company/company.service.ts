import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCompanyResponseDto } from './dto/create';
import { ErrorUtil } from 'src/common/utils/error-util';

@Injectable()
export class CompanyService {
  constructor(private readonly db: DatabaseService) {}

  async create(
    payload: CreateCompanyResponseDto,
    userId: number,
  ): Promise<string> {
    
    await this.db.companies
      .create({
        data: {
          company_name: payload.companyName,
          company_manager: payload.companyManager,
          lat: payload.lat,
          lng: payload.lng,
          created_by: userId,
        },
      })
      .catch((e) => {
        console.error(e);
        ErrorUtil.internalServerError('Unable to add company');
      });

    return 'Company created successfully';
  }
}
