import { IsString, IsOptional, IsBoolean, IsInt, IsEmail, IsUrl } from 'class-validator';

export class UpdateInstituteSettingsDto {
  @IsString()
  @IsOptional()
  instituteName?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  alternatePhone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  pincode?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  academicYear?: string;
}

export class UpdateAttendanceSettingsDto {
  @IsInt()
  @IsOptional()
  minimumAttendancePercentage?: number;

  @IsBoolean()
  @IsOptional()
  allowLateMarking?: boolean;

  @IsInt()
  @IsOptional()
  autoAbsentAfterMinutes?: number;

  @IsBoolean()
  @IsOptional()
  notifyLowAttendance?: boolean;
}

export class UpdateFeeSettingsDto {
  @IsInt()
  @IsOptional()
  defaultDueDay?: number;

  @IsBoolean()
  @IsOptional()
  enablePartialPayments?: boolean;

  @IsBoolean()
  @IsOptional()
  autoGenerateMonthlyFees?: boolean;

  @IsBoolean()
  @IsOptional()
  overduePenaltyEnabled?: boolean;
}

export class UpdateNotificationSettingsDto {
  @IsBoolean()
  @IsOptional()
  emailNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  smsNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  pushNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  attendanceAlerts?: boolean;

  @IsBoolean()
  @IsOptional()
  feeAlerts?: boolean;
}
