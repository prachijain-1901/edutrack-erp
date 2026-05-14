import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { RecordPaymentDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  recordPayment(@Body() data: RecordPaymentDto) {
    return this.paymentsService.recordPayment(data);
  }

  @Get(':studentId')
  getPaymentsByStudent(@Param('studentId') studentId: string) {
    return this.paymentsService.getPaymentsByStudent(studentId);
  }
}
