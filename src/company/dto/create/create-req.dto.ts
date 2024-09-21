import {
  IsString,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCompanyRequestDto {
  @IsString()
  companyName: string;

  @IsNumber()
  companyManager: number;

  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;

  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) => value.map((day: string) => Number(day))) // Transforms the array of strings to numbers
  @IsNumber({}, { each: true }) // Ensures each element in the array is a number after transformation
  @IsIn([1, 2, 3, 4, 5, 6, 7], { each: true }) // Validates that each number is a valid day
  weekdays: number[]; // Example: [1, 2]
}
