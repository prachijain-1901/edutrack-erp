import { Module } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { TemplateService } from './template.service';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppListener } from './listeners/whatsapp.listener';

@Module({
  controllers: [WhatsAppController],
  providers: [WhatsAppService, TemplateService, WhatsAppListener],
  exports: [WhatsAppService, TemplateService],
})
export class WhatsAppModule {}
