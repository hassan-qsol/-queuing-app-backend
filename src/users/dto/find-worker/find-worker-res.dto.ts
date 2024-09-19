
class EmergencyRole {
  id: number;
  role: string;
  icon: string;
  selected: boolean;
}

class EmergencyContact {
  name: string;
  phone: string;
  relationship?: string;
}

export class findWorkerResponseDto {
  user_id: number;
  first_name: string;
  last_name: string;
  user_name: string;
  picture?: string;
  email: string;
  status: boolean;
  language?: string;
  time_zone: string;
  password_type: string;
  green_hand_is_active: boolean;
  green_hand_date?: Date;
  user_details_supervisor?: string;
  user_details_positions?: string;
  user_details_location?: string;
  user_details_hireDate?: Date;
  worker_type?: string;
  contractor_company?: string;
  contractor_city?: string;
  contractor_address?: string;
  contractor_province?: string;
  contractor_zip?: string;
  contact_info_ext?: string;
  contact_info_cell_phone?: string;
  contact_info_home_phone?: string;
  contact_info_office_phone?: string;
  shared_notes?: string;
  emergencyRoles: EmergencyRole[] | [];
  emergencyContact: EmergencyContact[] | [];
  //
  hr_notes_address?: string;
  hr_notes_suite?: string;
  hr_notes_country?: string;
  hr_notes_province?: string;
  hr_notes_city?: string;
  hr_notes_zip_code?: string;
  hr_status_release_date?: Date;
  hr_status_eligible_for_hire_date?: Date;
  hr_status_release_reason?: string;
  personal_detail_dob?: Date;
  personal_detail_social?: string;
  personal_detail_health?: string;
  personal_detail_allergies?: string;
  notes?: string;
  documents?: string;
}
