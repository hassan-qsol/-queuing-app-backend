import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GlobalDynamicFilterRequestDTO {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === 'null' ? '' : value))
  id?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === 'null' ? '' : value))
  course_name?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === 'null' ? '' : value))
  categories?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === 'null' ? '' : value))
  locations?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === 'null' ? '' : value))
  positions?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === 'null' ? '' : value))
  timezone?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === 'null' ? '' : value))
  workers?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === 'null' ? '' : value))
  supervisedBy?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === 'null' ? '' : value))
  workerType?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === 'null' ? '' : value))
  emergencyRoles?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === 'null' ? '' : value))
  greenHand?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' || value === 'null' ? '' : value))
  email?: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) =>
    value === '' || value === null || value === 'null' ? undefined : value,
  )
  start_date?: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) =>
    value === '' || value === null || value === 'null' ? undefined : value,
  )
  end_date?: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) =>
    value === '' || value === null || value === 'null' ? undefined : value,
  )
  createdOn?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' || value === null || value === 'null' ? undefined : value,
  )
  status?: string;

  @IsOptional()
  @IsInt()
  progress?: number;
}
