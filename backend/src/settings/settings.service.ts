import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  UpdateInstituteSettingsDto,
  UpdateAttendanceSettingsDto,
  UpdateFeeSettingsDto,
  UpdateNotificationSettingsDto
} from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  // Institute Settings
  async getInstituteSettings() {
    const settings = await this.prisma.instituteSettings.findFirst();
    if (!settings) {
      return this.prisma.instituteSettings.create({ data: {} });
    }
    return settings;
  }

  async updateInstituteSettings(data: UpdateInstituteSettingsDto) {
    const current = await this.getInstituteSettings();
    return this.prisma.instituteSettings.update({
      where: { id: current.id },
      data,
    });
  }

  // Attendance Settings
  async getAttendanceSettings() {
    const settings = await this.prisma.attendanceSettings.findFirst();
    if (!settings) {
      return this.prisma.attendanceSettings.create({ data: {} });
    }
    return settings;
  }

  async updateAttendanceSettings(data: UpdateAttendanceSettingsDto) {
    const current = await this.getAttendanceSettings();
    return this.prisma.attendanceSettings.update({
      where: { id: current.id },
      data,
    });
  }

  // Fee Settings
  async getFeeSettings() {
    const settings = await this.prisma.feeSettings.findFirst();
    if (!settings) {
      return this.prisma.feeSettings.create({ data: {} });
    }
    return settings;
  }

  async updateFeeSettings(data: UpdateFeeSettingsDto) {
    const current = await this.getFeeSettings();
    return this.prisma.feeSettings.update({
      where: { id: current.id },
      data,
    });
  }

  // Notification Settings
  async getNotificationSettings() {
    const settings = await this.prisma.notificationSettings.findFirst();
    if (!settings) {
      return this.prisma.notificationSettings.create({ data: {} });
    }
    return settings;
  }

  async updateNotificationSettings(data: UpdateNotificationSettingsDto) {
    const current = await this.getNotificationSettings();
    return this.prisma.notificationSettings.update({
      where: { id: current.id },
      data,
    });
  }
}
