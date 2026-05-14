import { apiClient } from "@/lib/api-client";
import type { MessageLog, MessageTemplate, WhatsAppStats, ApiResponse } from "@/types";

export const whatsappService = {
  /**
   * Send a WhatsApp message
   */
  async sendMessage(data: {
    recipient: string;
    message: string;
    templateId?: string;
    variables?: Record<string, string>;
  }): Promise<MessageLog> {
    return apiClient("/whatsapp/send", {
      method: "POST",
      data,
    });
  },

  /**
   * Get communication logs
   */
  async getLogs(skip = 0, take = 50): Promise<MessageLog[]> {
    return apiClient(`/whatsapp/logs?skip=${skip}&take=${take}`);
  },

  /**
   * Get WhatsApp stats
   */
  async getStats(): Promise<WhatsAppStats> {
    return apiClient("/whatsapp/stats");
  },

  /**
   * Get all templates
   */
  async getTemplates(): Promise<MessageTemplate[]> {
    return apiClient("/whatsapp/templates");
  },

  /**
   * Create a new template
   */
  async createTemplate(data: {
    name: string;
    content: string;
    variables: string[];
    type?: string;
  }): Promise<MessageTemplate> {
    return apiClient("/whatsapp/templates", {
      method: "POST",
      data,
    });
  },

  /**
   * Retry all failed messages
   */
  async retryFailedMessages(): Promise<{ retried: number }> {
    return apiClient("/whatsapp/retry", {
      method: "POST",
    });
  },
};
