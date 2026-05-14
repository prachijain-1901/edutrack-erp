import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WhatsAppService } from '../whatsapp.service';
import { TemplateService } from '../template.service';
import { ERP_EVENTS } from '../../events/events.constants';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WhatsAppListener {
  private readonly logger = new Logger(WhatsAppListener.name);

  constructor(
    private readonly whatsappService: WhatsAppService,
    private readonly templateService: TemplateService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Auto-send welcome message when a student is created
   */
  @OnEvent(ERP_EVENTS.STUDENT.CREATED)
  async handleStudentCreated(payload: any) {
    try {
      const { studentId } = payload;
      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
        include: { parent: true },
      });

      if (!student || !student.phone) return;

      const template = await this.templateService.getTemplateByName('WELCOME_STUDENT');
      const message = this.templateService.formatMessage(template.content, {
        name: student.firstName,
      });

      await this.whatsappService.sendMessage({
        recipient: student.phone,
        message,
        templateId: template.id,
      });
    } catch (error) {
      this.logger.error(`Error in handleStudentCreated: ${error.message}`);
    }
  }

  /**
   * Auto-send alert when a student is marked absent
   */
  @OnEvent(ERP_EVENTS.ATTENDANCE.ABSENT)
  async handleStudentAbsent(payload: any) {
    try {
      const { studentId, batchId, date } = payload;
      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
        include: { parent: true },
      });

      const batch = await this.prisma.batch.findUnique({
        where: { id: batchId },
      });

      if (!student || !student.phone) return;

      const template = await this.templateService.getTemplateByName('ATTENDANCE_ABSENT');
      const message = this.templateService.formatMessage(template.content, {
        name: student.firstName,
        batch: batch?.name || 'Batch',
        date: new Date(date).toLocaleDateString(),
      });

      // Send to student or parent based on settings
      await this.whatsappService.sendMessage({
        recipient: student.phone,
        message,
        templateId: template.id,
      });
    } catch (error) {
      this.logger.error(`Error in handleStudentAbsent: ${error.message}`);
    }
  }

  /**
   * Auto-send confirmation when fee is paid
   */
  @OnEvent(ERP_EVENTS.FEE.PAYMENT_RECEIVED)
  async handlePaymentReceived(payload: any) {
    try {
      const { paymentId } = payload;
      const payment = await this.prisma.payment.findUnique({
        where: { id: paymentId },
        include: { studentFee: { include: { student: true } } },
      });

      if (!payment || !payment.studentFee.student.phone) return;

      const template = await this.templateService.getTemplateByName('FEE_RECEIPT');
      const message = this.templateService.formatMessage(template.content, {
        name: payment.studentFee.student.firstName,
        amount: payment.amount.toString(),
        receipt: payment.receiptNumber,
      });

      await this.whatsappService.sendMessage({
        recipient: payment.studentFee.student.phone,
        message,
        templateId: template.id,
      });
    } catch (error) {
      this.logger.error(`Error in handlePaymentReceived: ${error.message}`);
    }
  }
}
