import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCompanyRequestDto } from './dto/create';
import { ErrorUtil } from 'src/common/utils/error-util';
import { TUserAuthorized } from 'src/users/dto/find-authorized-user';
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
      console.log(userId)

    await this.db.$transaction(async (prisma) => {
      const company = await prisma.companies
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
          console.error(e.message)
          if (e.code === 'P2002')
            ErrorUtil.badRequest(
              'Company name already exists! Please try a different one.',
            );

          ErrorUtil.internalServerError('Unable to add company');
        });
      const weekdayPayload = payload.weekdays.map((day) => ({
        weekday_id: day,
        company_id: company.id,
        created_by: userId,
      }));
      await prisma.company_operating_days
        .createMany({ data: weekdayPayload })
        .catch((e) => {
          console.error(e.message);
          ErrorUtil.internalServerError('Unable to add weekdays');
        });
    });

    return 'Company created successfully';
  }

  async find(
    payload: TUserAuthorized | undefined,
  ): Promise<FindCompaniesResponseDto[]> {
    const filter = {
      include: {
        operating_days: {
          select: {
            id: true,
            weekday_id: true,
            weekday: {
              select: {
                day_name: true,
              },
            },
          },
        },
      },
    };

    if (payload?.user_type === 'MANAGER')
      filter['where'] = { company_manager: payload.id };

    const companies = await this.db.companies.findMany(filter);

    if (!companies.length) ErrorUtil.notFound('Companies not found.');

    return companies.map((company) => ({
      id: company.id,
      companyName: company.company_name,
      companyManager: company.company_manager,
      lat: company.lat,
      lng: company.lng,
      operating_days: company.operating_days,
    }));
  }
}
