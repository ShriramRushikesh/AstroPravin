import { IsNotEmpty, IsString, IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateKundliDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(31)
  day: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(23)
  hour: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(59)
  minute: number;

  @IsNotEmpty()
  @IsString()
  place: string;

  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsOptional()
  @IsString()
  birthTime?: string;
}
