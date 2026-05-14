import { WhatsAppService } from '../whatsapp.service';
import { TemplateService } from '../template.service';
import { PrismaService } from '../../prisma/prisma.service';
export declare class WhatsAppListener {
    private readonly whatsappService;
    private readonly templateService;
    private readonly prisma;
    private readonly logger;
    constructor(whatsappService: WhatsAppService, templateService: TemplateService, prisma: PrismaService);
    handleStudentCreated(payload: any): Promise<void>;
    handleStudentAbsent(payload: any): Promise<void>;
    handlePaymentReceived(payload: any): Promise<void>;
}
