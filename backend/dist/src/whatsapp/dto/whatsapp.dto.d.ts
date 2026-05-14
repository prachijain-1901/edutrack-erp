export declare class SendWhatsAppDto {
    recipient: string;
    message: string;
    templateId?: string;
    variables?: Record<string, string>;
}
export declare class CreateTemplateDto {
    name: string;
    content: string;
    variables?: string[];
    type?: 'TRANSACTIONAL' | 'PROMOTIONAL' | 'OTP';
}
