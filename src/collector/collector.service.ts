import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { ErrorUtil } from 'src/common/utils/errors.utils';
import { FindCollectorsResponseDto } from './dto/collectors';
import { CollectorException } from 'src/common/exceptions';
import { LoginCollectorRequestDto } from './dto/login-collector';
import { LoginCollectorResponseDto } from './dto/login-collector/login-collector-res.dto';
import { EUserType } from '@prisma/client';

@Injectable()
export class CollectorService {
  constructor(
    private readonly db: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async findCollectors(): Promise<FindCollectorsResponseDto[]> {
    const collectors = await this.db.collectors
      .findMany({
        where: { is_deleted: false },
        select: { id: true, cnic: true },
      })
      .catch((e) => {
        console.error(e);
        ErrorUtil.internalServerError(CollectorException.collectorsNotFound());
      });
    if (!collectors.length)
      ErrorUtil.notFound(CollectorException.collectorsNotFound());

    return collectors.map((collector) => ({
      id: String(collector.id),
      cnic: collector.cnic,
    }));
  }

  async loginCollector(
    payload: LoginCollectorRequestDto,
  ): Promise<LoginCollectorResponseDto> {
    let collector = await this.db.collectors.findFirst({
      where: { cnic: payload.cnic },
    });

    if (!collector)
      collector = await this.db.collectors
        .create({
          data: {
            cnic: payload.cnic,
          },
        })
        .catch((e) => {
          console.error(e);
          ErrorUtil.internalServerError(CollectorException.collectorNotLogin());
        });

    const accessToken = this.jwtService.sign({
      collector_id: collector.id,
    });

    return {
      id: collector.id,
      userType: EUserType.CUSTOMER,
      cnic: collector.cnic,
      accessToken: accessToken,
    };
  }
}
