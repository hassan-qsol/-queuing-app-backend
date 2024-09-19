import { IsNumber, IsBoolean } from 'class-validator';

export class ModifyWeeklyReminderRequestDto {
  @IsNumber()
  user_id: number;

  @IsBoolean()
  weeklyReminder: boolean;
}
