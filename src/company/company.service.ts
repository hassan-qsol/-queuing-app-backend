import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCompanyRequestDto } from './dto/create';
import { ErrorUtil } from 'src/common/utils/error-util';
import { findAuthorizedUserResponseDto } from 'src/users/dto/find-authorized-user';
import { FindCompaniesResponseDto } from './dto/find';

@Injectable()
export class CompanyService {
  constructor(private readonly db: DatabaseService) {}

  async create(
    payload: CreateCompanyRequestDto,
    userId: number,
  ): Promise<string> {
    const userExists = await this.db.companies.findFirst({
      where: { company_manager: payload.companyManager },
    });
    if (userExists)
      ErrorUtil.badRequest(
        'Manager is already linked with a company! Please select other manager.',
      );

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
        if (e.code === 'P2002')
          ErrorUtil.badRequest(
            'Company name already exists! Please try a different one.',
          );

        ErrorUtil.internalServerError('Unable to add company');
      });

    return 'Company created successfully';
  }

  async find(payload: findAuthorizedUserResponseDto): Promise<FindCompaniesResponseDto[]> {
    let filter = {};
    if (payload.user_type === 'MANAGER')
      filter = {
        where: { company_manager: payload.id },
      };

    const companies = await this.db.companies.findMany(filter);
    if(!companies.length) ErrorUtil.notFound("Companies not found.")
    return companies;
  }
}
