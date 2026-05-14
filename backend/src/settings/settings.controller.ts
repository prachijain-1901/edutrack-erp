import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { 
  UpdateInstituteSettingsDto,
  UpdateAttendanceSettingsDto,
  UpdateFeeSettingsDto,
  UpdateNotificationSettingsDto
} from './dto/settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.ADMIN) // Only Owners/Admins can manage settings
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('institute')
  getInstituteSettings() {
    return this.settingsService.getInstituteSettings();
  }

  @Patch('institute')
  updateInstituteSettings(@Body() data: UpdateInstituteSettingsDto) {
    return this.settingsService.updateInstituteSettings(data);
  }

  @Get('attendance')
  getAttendanceSettings() {
    return this.settingsService.getAttendanceSettings();
  }

  @Patch('attendance')
  updateAttendanceSettings(@Body() data: UpdateAttendanceSettingsDto) {
    return this.settingsService.updateAttendanceSettings(data);
  }

  @Get('fees')
  getFeeSettings() {
    return this.settingsService.getFeeSettings();
  }

  @Patch('fees')
  updateFeeSettings(@Body() data: UpdateFeeSettingsDto) {
    return this.settingsService.updateFeeSettings(data);
  }

  @Get('notifications')
  getNotificationSettings() {
    return this.settingsService.getNotificationSettings();
  }

  @Patch('notifications')
  updateNotificationSettings(@Body() data: UpdateNotificationSettingsDto) {
    return this.settingsService.updateNotificationSettings(data);
  }
}
