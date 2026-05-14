import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { FeesService } from './fees.service';
import { CreateFeePlanDto, AssignFeePlanDto } from './dto/fee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('fees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Post('plans')
  @Roles(Role.OWNER, Role.ADMIN)
  createPlan(@Body() data: CreateFeePlanDto) {
    return this.feesService.createPlan(data);
  }

  @Get('plans')
  getPlans() {
    return this.feesService.getPlans();
  }

  @Post('assign')
  @Roles(Role.OWNER, Role.ADMIN)
  assignPlan(@Body() data: AssignFeePlanDto) {
    return this.feesService.assignPlan(data);
  }

  @Get('student/:id')
  getStudentFees(@Param('id') id: string) {
    return this.feesService.getStudentFees(id);
  }

  @Get('pending')
  getPendingFees() {
    return this.feesService.getPendingFees();
  }
}
