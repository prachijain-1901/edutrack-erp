import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto } from './dto/whatsapp.dto';

@Injectable()
export class TemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async createTemplate(dto: CreateTemplateDto) {
    const existing = await this.prisma.messageTemplate.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Template with this name already exists');
    }

    return this.prisma.messageTemplate.create({
      data: {
        name: dto.name,
        content: dto.content,
        variables: dto.variables || [],
        type: dto.type || 'TRANSACTIONAL',
      },
    });
  }

  async getTemplates() {
    return this.prisma.messageTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTemplateByName(name: string) {
    const template = await this.prisma.messageTemplate.findUnique({
      where: { name },
    });

    if (!template) {
      throw new NotFoundException(`Template ${name} not found`);
    }

    return template;
  }

  /**
   * Replace variables in a template content
   * Content example: "Hello {{name}}, your fee of {{amount}} is due."
   */
  formatMessage(content: string, variables: Record<string, string>) {
    let message = content;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      message = message.replace(regex, value);
    });
    return message;
  }
}
