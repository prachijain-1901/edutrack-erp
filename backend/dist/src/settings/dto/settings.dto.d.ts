export declare class UpdateInstituteSettingsDto {
    instituteName?: string;
    logo?: string;
    email?: string;
    phone?: string;
    alternatePhone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    website?: string;
    timezone?: string;
    currency?: string;
    academicYear?: string;
}
export declare class UpdateAttendanceSettingsDto {
    minimumAttendancePercentage?: number;
    allowLateMarking?: boolean;
    autoAbsentAfterMinutes?: number;
    notifyLowAttendance?: boolean;
}
export declare class UpdateFeeSettingsDto {
    defaultDueDay?: number;
    enablePartialPayments?: boolean;
    autoGenerateMonthlyFees?: boolean;
    overduePenaltyEnabled?: boolean;
}
export declare class UpdateNotificationSettingsDto {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
    attendanceAlerts?: boolean;
    feeAlerts?: boolean;
}
