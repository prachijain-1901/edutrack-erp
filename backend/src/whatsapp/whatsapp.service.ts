import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendWhatsAppDto } from './dto/whatsapp.dto';
import { WhatsAppStatus } from '@prisma/client';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Send a WhatsApp message (Placeholder for Meta WhatsApp Business API)
   */
  async sendMessage(dto: SendWhatsAppDto) {
    const { recipient, message, templateId, variables } = dto;

    // 1. Create a log entry (PENDING)
    const log = await this.prisma.messageLog.create({
      data: {
        recipient,
        message,
        templateId,
        status: 'PENDING',
      },
    });

    try {
      // 2. Integration logic with Meta API would go here
      // Example: axios.post('https://graph.facebook.com/v17.0/.../messages', ...)
      
      this.logger.log(`Sending WhatsApp to ${recipient}: ${message.substring(0, 30)}...`);

      // MOCK: Simulate API success
      const success = true;

      if (success) {
        // 3. Update log as SENT
        return await this.prisma.messageLog.update({
          where: { id: log.id },
          data: {
            status: 'SENT',
            sentAt: new Date(),
          },
        });
      } else {
        throw new Error('Failed to send via Meta API');
      }
    } catch (error) {
      this.logger.error(`WhatsApp failed for ${recipient}: ${error.message}`);
      
      // 4. Update log as FAILED
      return await this.prisma.messageLog.update({
        where: { id: log.id },
        data: {
          status: 'FAILED',
          error: error.message,
        },
      });
    }
  }

  async getLogs(skip = 0, take = 50) {
    return this.prisma.messageLog.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { template: true },
    });
  }

  async getStats() {
    const total = await this.prisma.messageLog.count();
    const sent = await this.prisma.messageLog.count({ where: { status: 'SENT' } });
    const failed = await this.prisma.messageLog.count({ where: { status: 'FAILED' } });
    const delivered = await this.prisma.messageLog.count({ where: { status: 'DELIVERED' } });

    return { total, sent, failed, delivered };
  }

  /**
   * Retry failed messages with exponential backoff logic (simplified)
   */
  async retryFailedMessages() {
    const failedLogs = await this.prisma.messageLog.findMany({
      where: { status: 'FAILED' },
      take: 20,
    });

    this.logger.log(`Retrying ${failedLogs.length} failed messages...`);

    for (const log of failedLogs) {
      // Logic for checking retry count and applying exponential backoff would go here
      // For now, we just try to resend
      await this.sendMessage({
        recipient: log.recipient,
        message: log.message,
        templateId: log.templateId || undefined,
      });
      
      // Delete the old failed log or update it
      await this.prisma.messageLog.delete({ where: { id: log.id } });
    }
    
    return { retried: failedLogs.length };
  }
}
