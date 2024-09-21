import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateServiceRequestDto } from './dto/create';
import { ErrorUtil } from 'src/common/utils/error-util';
import { FindServicesRequestDto, FindServicesResponseDto } from './dto/find';

@Injectable()
export class ServiceService {
  constructor(private readonly db: DatabaseService) {}

  async create(
    payload: CreateServiceRequestDto,
    createdBy: number,
  ): Promise<string> {
    // Normalize service name by converting to lowercase and trimming spaces
    const normalizedServiceName = payload.serviceName.trim().toLowerCase();

    const serviceExists = await this.db.services.findFirst({
      where: {
        name: normalizedServiceName,
        company_id: payload.companyId,
        is_deleted: false,
      },
    });

    if (serviceExists)
      ErrorUtil.badRequest(
        'A service with this name is already linked with the company! Please use a different name.',
      );

    await this.db.services
      .create({
        data: {
          name: normalizedServiceName,
          description: payload.serviceDescription,
          company_id: payload.companyId,
          created_by: createdBy,
        },
      })
      .catch((e) => {
        console.error(e.message);
        ErrorUtil.internalServerError('Unable to add service');
      });

    return 'Service created successfully';
  }

  async find({
    companyId,
  }: FindServicesRequestDto): Promise<FindServicesResponseDto[]> {
    const services = await this.db.services.findMany({
      where: {
        company_id: companyId,
        is_deleted: false,
      },
    });

    if (!services.length) ErrorUtil.notFound('Services not found.');

    return services;
  }
}
