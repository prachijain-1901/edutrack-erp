import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto, BulkMarkAttendanceDto } from './dto/attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('mark')
  @Roles(Role.TEACHER, Role.ADMIN, Role.OWNER)
  markSingle(@Body() data: MarkAttendanceDto, @Request() req: any) {
    return this.attendanceService.markSingle(data, req.user.id);
  }

  @Post('bulk')
  @Roles(Role.TEACHER, Role.ADMIN, Role.OWNER)
  markBulk(@Body() data: BulkMarkAttendanceDto, @Request() req: any) {
    return this.attendanceService.markBulk(data, req.user.id);
  }

  @Get('batch/:batchId')
  getByBatch(@Param('batchId') batchId: string, @Query('date') date: string) {
    return this.attendanceService.getByBatch(batchId, date);
  }

  @Get('student/:studentId')
  getByStudent(@Param('studentId') studentId: string, @Query('limit') limit?: string) {
    return this.attendanceService.getByStudent(studentId, limit ? parseInt(limit) : 30);
  }

  @Get('summary')
  getSummary(@Query('date') date?: string, @Query('batchId') batchId?: string) {
    return this.attendanceService.getSummary(date, batchId);
  }
}
