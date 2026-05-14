import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { TemplateService } from './template.service';
import { SendWhatsAppDto, CreateTemplateDto } from './dto/whatsapp.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('whatsapp')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WhatsAppController {
  constructor(
    private readonly whatsappService: WhatsAppService,
    private readonly templateService: TemplateService,
  ) {}

  @Post('send')
  @Roles('OWNER', 'ADMIN')
  async send(@Body() dto: SendWhatsAppDto) {
    return this.whatsappService.sendMessage(dto);
  }

  @Get('logs')
  @Roles('OWNER', 'ADMIN')
  async getLogs(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.whatsappService.getLogs(skip, take);
  }

  @Get('stats')
  @Roles('OWNER', 'ADMIN')
  async getStats() {
    return this.whatsappService.getStats();
  }

  @Post('retry')
  @Roles('OWNER', 'ADMIN')
  async retry() {
    return this.whatsappService.retryFailedMessages();
  }

  @Post('templates')
  @Roles('OWNER', 'ADMIN')
  async createTemplate(@Body() dto: CreateTemplateDto) {
    return this.templateService.createTemplate(dto);
  }

  @Get('templates')
  @Roles('OWNER', 'ADMIN')
  async getTemplates() {
    return this.templateService.getTemplates();
  }
}
