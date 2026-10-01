import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MatrimonyProfileDocument = MatrimonyProfile & Document;

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum ProfileFor {
  SELF = 'Self',
  SON = 'Son',
  DAUGHTER = 'Daughter',
  BROTHER = 'Brother',
  SISTER = 'Sister',
  RELATIVE = 'Relative',
  FRIEND = 'Friend',
}

@Schema({ collection: 'matrimony_profiles', timestamps: true })
export class MatrimonyProfile {
  @Prop({ type: Types.ObjectId, ref: 'MatrimonyUser', required: true, unique: true, index: true })
  userId: Types.ObjectId;

  // Personal Info
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop()
  dateOfBirth: Date;

  @Prop({ type: String, enum: ['male', 'female', 'other'], index: true })
  gender: string;

  @Prop({ index: true })
  religion: string;

  @Prop({ index: true })
  caste: string;

  @Prop()
  subCaste: string;

  @Prop()
  gotra: string;

  @Prop()
  motherTongue: string;

  @Prop({
    type: String,
    enum: ['never_married', 'divorced', 'widowed', 'awaiting_divorce'],
    default: 'never_married',
    index: true,
  })
  maritalStatus: string;

  @Prop()
  height: number; // in cm

  @Prop()
  weight: number; // in kg

  @Prop()
  complexion: string;

  @Prop()
  bloodGroup: string;

  @Prop({ default: false })
  disability: boolean;

  @Prop()
  disabilityDetails: string;

  // Astrological
  @Prop()
  birthTime: string;

  @Prop()
  birthPlace: string;

  @Prop()
  rashi: string;

  @Prop()
  nakshatra: string;

  @Prop({ type: String, enum: ['yes', 'no', 'partial'], default: 'no' })
  manglik: string;

  // Education & Career
  @Prop()
  education: string;

  @Prop()
  educationDetails: string;

  @Prop()
  occupation: string;

  @Prop()
  employerName: string;

  @Prop({ default: 0 })
  annualIncome: number;

  @Prop()
  workCity: string;

  @Prop()
  workCountry: string;

  // Family
  @Prop()
  fatherName: string;

  @Prop()
  fatherOccupation: string;

  @Prop()
  motherName: string;

  @Prop()
  motherOccupation: string;

  @Prop({ default: 0 })
  siblings: number;

  @Prop()
  siblingDetails: string;

  @Prop({ type: String, enum: ['joint', 'nuclear'], default: 'nuclear' })
  familyType: string;

  @Prop({ type: String, enum: ['middle_class', 'upper_middle_class', 'rich'], default: 'middle_class' })
  familyStatus: string;

  @Prop()
  nativePlace: string;

  // Contact (Controlled visibility)
  @Prop({ trim: true })
  mobile: string;

  @Prop({ trim: true })
  alternatePhone: string;

  @Prop({ trim: true })
  email: string;

  @Prop({ index: true })
  currentCity: string;

  @Prop()
  currentState: string;

  @Prop()
  currentCountry: string;

  // Partner Preferences
  @Prop({ default: 18 })
  partnerAgeMin: number;

  @Prop({ default: 60 })
  partnerAgeMax: number;

  @Prop({ default: 140 })
  partnerHeightMin: number;

  @Prop({ default: 210 })
  partnerHeightMax: number;

  @Prop({ type: [String], default: [] })
  partnerReligion: string[];

  @Prop({ type: [String], default: [] })
  partnerCaste: string[];

  @Prop({ type: [String], default: [] })
  partnerMaritalStatus: string[];

  @Prop()
  partnerEducation: string;

  @Prop()
  partnerOccupation: string;

  @Prop({ default: 0 })
  partnerAnnualIncomeMin: number;

  @Prop({ default: 'any' })
  partnerManglik: string;

  @Prop({ type: [String], default: [] })
  partnerLocation: string[];

  // Profile Controls (admin / computed)
  @Prop({ default: false })
  isContactVisible: boolean;

  @Prop({ default: false, index: true })
  isProfileFeatured: boolean;

  @Prop({ default: 0 })
  profileCompleteness: number;

  @Prop()
  adminNotes: string;

  @Prop()
  verifiedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser' })
  verifiedByAdmin: Types.ObjectId;

  @Prop()
  rejectionReason: string;
}

export const MatrimonyProfileSchema = SchemaFactory.createForClass(MatrimonyProfile);
MatrimonyProfileSchema.index({ gender: 1, religion: 1, caste: 1, currentCity: 1 });
MatrimonyProfileSchema.index({ isProfileFeatured: 1, profileCompleteness: -1 });
