import {
  IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber,
  IsEmail, IsArray, ValidateNested, IsBoolean, MaxLength, Min, Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender, ProfileFor } from '../schemas/matrimony-profile.schema';

class EducationDto {
  @IsString() @IsOptional() highest_education?: string;
  @IsString() @IsOptional() education_detail?: string;
  @IsString() @IsOptional() college?: string;
  @IsString() @IsOptional() employed_in?: string;
  @IsString() @IsOptional() occupation?: string;
  @IsString() @IsOptional() annual_income?: string;
}

class FamilyDto {
  @IsString() @IsOptional() family_type?: string;
  @IsString() @IsOptional() family_status?: string;
  @IsString() @IsOptional() father_name?: string;
  @IsString() @IsOptional() father_occupation?: string;
  @IsString() @IsOptional() mother_name?: string;
  @IsString() @IsOptional() mother_occupation?: string;
  @IsNumber() @IsOptional() brothers?: number;
  @IsNumber() @IsOptional() sisters?: number;
  @IsNumber() @IsOptional() brothers_married?: number;
  @IsNumber() @IsOptional() sisters_married?: number;
  @IsString() @IsOptional() native_place?: string;
}

class LifestyleDto {
  @IsString() @IsOptional() diet?: string;
  @IsString() @IsOptional() smoking?: string;
  @IsString() @IsOptional() drinking?: string;
  @IsArray() @IsOptional() hobbies?: string[];
  @IsString() @IsOptional() mother_tongue?: string;
  @IsArray() @IsOptional() languages_known?: string[];
}

class HoroscopeDto {
  @IsString() @IsOptional() rashi?: string;
  @IsString() @IsOptional() nakshatra?: string;
  @IsString() @IsOptional() gotra?: string;
  @IsString() @IsOptional() nadi?: string;
  @IsString() @IsOptional() manglik?: string;
  @IsString() @IsOptional() birth_date?: string;
  @IsString() @IsOptional() birth_time?: string;
  @IsString() @IsOptional() birth_place?: string;
}

class PartnerPreferencesDto {
  @IsNumber() @IsOptional() @Min(18) @Max(80) min_age?: number;
  @IsNumber() @IsOptional() @Min(18) @Max(80) max_age?: number;
  @IsString() @IsOptional() min_height?: string;
  @IsString() @IsOptional() max_height?: string;
  @IsString() @IsOptional() religion?: string;
  @IsArray() @IsOptional() caste?: string[];
  @IsArray() @IsOptional() location?: string[];
  @IsString() @IsOptional() income?: string;
  @IsString() @IsOptional() education?: string;
  @IsString() @IsOptional() diet?: string;
  @IsString() @IsOptional() manglik_preference?: string;
  @IsBoolean() @IsOptional() open_to_nri?: boolean;
}

export class CreateMatrimonyProfileDto {
  @IsEnum(ProfileFor) profile_for: ProfileFor;
  @IsString() @IsNotEmpty() full_name: string;
  @IsEnum(Gender) gender: Gender;
  @IsString() @IsNotEmpty() date_of_birth: string;
  @IsString() @IsOptional() height?: string;
  @IsString() @IsOptional() weight?: string;
  @IsString() @IsOptional() complexion?: string;
  @IsString() @IsOptional() blood_group?: string;
  @IsString() @IsOptional() religion?: string;
  @IsString() @IsOptional() caste?: string;
  @IsString() @IsOptional() sub_caste?: string;
  @IsString() @IsOptional() marital_status?: string;
  @IsString() @IsOptional() city?: string;
  @IsString() @IsOptional() state?: string;
  @IsString() @IsOptional() country?: string;
  @IsString() @IsOptional() contact_phone?: string;
  @IsEmail() @IsOptional() contact_email?: string;
  @IsString() @IsOptional() whatsapp_phone?: string;
  @IsString() @IsOptional() @MaxLength(1000) about_me?: string;

  @ValidateNested() @Type(() => EducationDto) @IsOptional() education?: EducationDto;
  @ValidateNested() @Type(() => FamilyDto) @IsOptional() family?: FamilyDto;
  @ValidateNested() @Type(() => LifestyleDto) @IsOptional() lifestyle?: LifestyleDto;
  @ValidateNested() @Type(() => HoroscopeDto) @IsOptional() horoscope?: HoroscopeDto;
  @ValidateNested() @Type(() => PartnerPreferencesDto) @IsOptional() partner_preferences?: PartnerPreferencesDto;
}

export class UpdateMatrimonyProfileDto extends CreateMatrimonyProfileDto {}

export class SearchProfilesDto {
  @IsString() @IsOptional() gender?: string;
  @IsNumber() @IsOptional() @Min(18) @Max(80) min_age?: number;
  @IsNumber() @IsOptional() @Min(18) @Max(80) max_age?: number;
  @IsString() @IsOptional() religion?: string;
  @IsString() @IsOptional() caste?: string;
  @IsString() @IsOptional() city?: string;
  @IsString() @IsOptional() state?: string;
  @IsString() @IsOptional() income?: string;
  @IsString() @IsOptional() education?: string;
  @IsString() @IsOptional() marital_status?: string;
  @IsNumber() @IsOptional() @Min(1) page?: number;
  @IsNumber() @IsOptional() @Min(1) @Max(50) limit?: number;
}
