import { SettingsService } from './settings.service';
import { UpdateInstituteSettingsDto, UpdateAttendanceSettingsDto, UpdateFeeSettingsDto, UpdateNotificationSettingsDto } from './dto/settings.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getInstituteSettings(): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        instituteName: string;
        logo: string | null;
        alternatePhone: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        pincode: string | null;
        website: string | null;
        timezone: string;
        currency: string;
        academicYear: string;
    }>;
    updateInstituteSettings(data: UpdateInstituteSettingsDto): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        instituteName: string;
        logo: string | null;
        alternatePhone: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        pincode: string | null;
        website: string | null;
        timezone: string;
        currency: string;
        academicYear: string;
    }>;
    getAttendanceSettings(): Promise<{
        id: string;
        minimumAttendancePercentage: number;
        allowLateMarking: boolean;
        autoAbsentAfterMinutes: number;
        notifyLowAttendance: boolean;
    }>;
    updateAttendanceSettings(data: UpdateAttendanceSettingsDto): Promise<{
        id: string;
        minimumAttendancePercentage: number;
        allowLateMarking: boolean;
        autoAbsentAfterMinutes: number;
        notifyLowAttendance: boolean;
    }>;
    getFeeSettings(): Promise<{
        id: string;
        defaultDueDay: number;
        enablePartialPayments: boolean;
        autoGenerateMonthlyFees: boolean;
        overduePenaltyEnabled: boolean;
    }>;
    updateFeeSettings(data: UpdateFeeSettingsDto): Promise<{
        id: string;
        defaultDueDay: number;
        enablePartialPayments: boolean;
        autoGenerateMonthlyFees: boolean;
        overduePenaltyEnabled: boolean;
    }>;
    getNotificationSettings(): Promise<{
        id: string;
        emailNotifications: boolean;
        smsNotifications: boolean;
        pushNotifications: boolean;
        attendanceAlerts: boolean;
        feeAlerts: boolean;
        whatsappNotifications: boolean;
    }>;
    updateNotificationSettings(data: UpdateNotificationSettingsDto): Promise<{
        id: string;
        emailNotifications: boolean;
        smsNotifications: boolean;
        pushNotifications: boolean;
        attendanceAlerts: boolean;
        feeAlerts: boolean;
        whatsappNotifications: boolean;
    }>;
}
