import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.ADMIN) // Primarily owner dashboard
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  getOverview() {
    return this.dashboardService.getOverview();
  }

  @Get('revenue')
  getRevenue() {
    return this.dashboardService.getRevenue();
  }

  @Get('attendance')
  getAttendance() {
    return this.dashboardService.getAttendance();
  }

  @Get('students')
  getStudents() {
    return this.dashboardService.getStudents();
  }

  @Get('alerts')
  getAlerts() {
    return this.dashboardService.getAlerts();
  }
}
