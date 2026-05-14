import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppGateway } from './socket.gateway';
import { ERP_EVENTS } from '../events/events.constants';

@Injectable()
export class SocketListener {
  private readonly logger = new Logger(SocketListener.name);

  constructor(private readonly gateway: AppGateway) {}

  /**
   * Listen for any ERP event and broadcast relevant updates
   */
  @OnEvent('**') // Listen to all events
  handleAnyEvent(event: string | string[], payload: any) {
    const eventName = Array.isArray(event) ? event.join('.') : event;
    
    this.logger.debug(`Realtime Bridge: ${eventName}`);

    // Logic to decide who receives the update
    // For most dashboard updates, we send to admins
    if (
      eventName.startsWith('fee.') || 
      eventName.startsWith('student.') || 
      eventName.startsWith('attendance.') ||
      eventName.startsWith('batch.')
    ) {
      this.gateway.sendToAdmins('dashboard_update', {
        type: eventName,
        payload,
        timestamp: new Date(),
      });
    }

    // New notification specific logic
    if (eventName === 'notification.created') {
      this.gateway.sendToUser(payload.recipientId, 'new_notification', payload);
    }
  }

  /**
   * Specific handler for payment received to trigger celebratory UI
   */
  @OnEvent(ERP_EVENTS.FEE.PAYMENT_RECEIVED)
  handlePayment(payload: any) {
    this.gateway.sendToAdmins('payment_received', payload);
  }

  /**
   * Specific handler for attendance alerts
   */
  @OnEvent(ERP_EVENTS.ATTENDANCE.ABSENT)
  handleAbsence(payload: any) {
    this.gateway.sendToAdmins('student_absent', payload);
  }
}
