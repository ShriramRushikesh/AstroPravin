import { IsOptional, IsString, IsNumber, IsBoolean, IsArray, IsDateString } from 'class-validator';

export class SaveProfileDto {
  // Personal
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() religion?: string;
  @IsOptional() @IsString() caste?: string;
  @IsOptional() @IsString() subCaste?: string;
  @IsOptional() @IsString() gotra?: string;
  @IsOptional() @IsString() motherTongue?: string;
  @IsOptional() @IsString() maritalStatus?: string;
  @IsOptional() @IsNumber() height?: number;
  @IsOptional() @IsNumber() weight?: number;
  @IsOptional() @IsString() complexion?: string;
  @IsOptional() @IsString() bloodGroup?: string;
  @IsOptional() @IsBoolean() disability?: boolean;
  @IsOptional() @IsString() disabilityDetails?: string;

  // Astrological
  @IsOptional() @IsString() birthTime?: string;
  @IsOptional() @IsString() birthPlace?: string;
  @IsOptional() @IsString() rashi?: string;
  @IsOptional() @IsString() nakshatra?: string;
  @IsOptional() @IsString() manglik?: string;

  // Education & Career
  @IsOptional() @IsString() education?: string;
  @IsOptional() @IsString() educationDetails?: string;
  @IsOptional() @IsString() occupation?: string;
  @IsOptional() @IsString() employerName?: string;
  @IsOptional() @IsNumber() annualIncome?: number;
  @IsOptional() @IsString() workCity?: string;
  @IsOptional() @IsString() workCountry?: string;

  // Family
  @IsOptional() @IsString() fatherName?: string;
  @IsOptional() @IsString() fatherOccupation?: string;
  @IsOptional() @IsString() motherName?: string;
  @IsOptional() @IsString() motherOccupation?: string;
  @IsOptional() @IsNumber() siblings?: number;
  @IsOptional() @IsString() siblingDetails?: string;
  @IsOptional() @IsString() familyType?: string;
  @IsOptional() @IsString() familyStatus?: string;
  @IsOptional() @IsString() nativePlace?: string;

  // Contact
  @IsOptional() @IsString() mobile?: string;
  @IsOptional() @IsString() alternatePhone?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() currentCity?: string;
  @IsOptional() @IsString() currentState?: string;
  @IsOptional() @IsString() currentCountry?: string;

  // Partner Preferences
  @IsOptional() @IsNumber() partnerAgeMin?: number;
  @IsOptional() @IsNumber() partnerAgeMax?: number;
  @IsOptional() @IsNumber() partnerHeightMin?: number;
  @IsOptional() @IsNumber() partnerHeightMax?: number;
  @IsOptional() @IsArray() partnerReligion?: string[];
  @IsOptional() @IsArray() partnerCaste?: string[];
  @IsOptional() @IsArray() partnerMaritalStatus?: string[];
  @IsOptional() @IsString() partnerEducation?: string;
  @IsOptional() @IsString() partnerOccupation?: string;
  @IsOptional() @IsNumber() partnerAnnualIncomeMin?: number;
  @IsOptional() @IsString() partnerManglik?: string;
  @IsOptional() @IsArray() partnerLocation?: string[];

  // Form step marker
  @IsOptional() @IsNumber() currentStep?: number;
  @IsOptional() @IsBoolean() isFinalSubmit?: boolean;
}
