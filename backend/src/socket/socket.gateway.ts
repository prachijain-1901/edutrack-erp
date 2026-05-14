import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, replace with specific origins
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      
      if (!token) {
        this.logger.warn(`Client disconnected: No token provided (${client.id})`);
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload;
      
      // Join a personal room for private notifications
      client.join(`user_${payload.sub}`);
      
      // Join role-based rooms
      if (payload.role === 'OWNER' || payload.role === 'ADMIN') {
        client.join('admins');
      }

      this.logger.log(`Client connected: ${payload.email} (${client.id})`);
    } catch (error) {
      this.logger.warn(`Client disconnected: Invalid token (${client.id})`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Broadcast an event to all connected clients
   */
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  /**
   * Send an event to a specific user
   */
  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user_${userId}`).emit(event, data);
  }

  /**
   * Send an event to all admins
   */
  sendToAdmins(event: string, data: any) {
    this.server.to('admins').emit(event, data);
  }
}
