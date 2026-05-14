"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AppGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let AppGateway = AppGateway_1 = class AppGateway {
    jwtService;
    server;
    logger = new common_1.Logger(AppGateway_1.name);
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
            if (!token) {
                this.logger.warn(`Client disconnected: No token provided (${client.id})`);
                client.disconnect();
                return;
            }
            const payload = await this.jwtService.verifyAsync(token);
            client.data.user = payload;
            client.join(`user_${payload.sub}`);
            if (payload.role === 'OWNER' || payload.role === 'ADMIN') {
                client.join('admins');
            }
            this.logger.log(`Client connected: ${payload.email} (${client.id})`);
        }
        catch (error) {
            this.logger.warn(`Client disconnected: Invalid token (${client.id})`);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    broadcast(event, data) {
        this.server.emit(event, data);
    }
    sendToUser(userId, event, data) {
        this.server.to(`user_${userId}`).emit(event, data);
    }
    sendToAdmins(event, data) {
        this.server.to('admins').emit(event, data);
    }
};
exports.AppGateway = AppGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AppGateway.prototype, "server", void 0);
exports.AppGateway = AppGateway = AppGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AppGateway);
//# sourceMappingURL=socket.gateway.js.map