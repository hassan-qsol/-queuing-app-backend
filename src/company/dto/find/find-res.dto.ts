export class FindCompaniesResponseDto {
  id: number;
  company_name: string;
  company_manager: number;
  lat: number;
  lng: number;
  is_deleted: boolean;
  is_active: boolean;
  created_at: Date;
  created_by: number;
}
