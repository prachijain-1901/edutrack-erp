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
var SocketListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const socket_gateway_1 = require("./socket.gateway");
const events_constants_1 = require("../events/events.constants");
let SocketListener = SocketListener_1 = class SocketListener {
    gateway;
    logger = new common_1.Logger(SocketListener_1.name);
    constructor(gateway) {
        this.gateway = gateway;
    }
    handleAnyEvent(event, payload) {
        const eventName = Array.isArray(event) ? event.join('.') : event;
        this.logger.debug(`Realtime Bridge: ${eventName}`);
        if (eventName.startsWith('fee.') ||
            eventName.startsWith('student.') ||
            eventName.startsWith('attendance.') ||
            eventName.startsWith('batch.')) {
            this.gateway.sendToAdmins('dashboard_update', {
                type: eventName,
                payload,
                timestamp: new Date(),
            });
        }
        if (eventName === 'notification.created') {
            this.gateway.sendToUser(payload.recipientId, 'new_notification', payload);
        }
    }
    handlePayment(payload) {
        this.gateway.sendToAdmins('payment_received', payload);
    }
    handleAbsence(payload) {
        this.gateway.sendToAdmins('student_absent', payload);
    }
};
exports.SocketListener = SocketListener;
__decorate([
    (0, event_emitter_1.OnEvent)('**'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SocketListener.prototype, "handleAnyEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)(events_constants_1.ERP_EVENTS.FEE.PAYMENT_RECEIVED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocketListener.prototype, "handlePayment", null);
__decorate([
    (0, event_emitter_1.OnEvent)(events_constants_1.ERP_EVENTS.ATTENDANCE.ABSENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SocketListener.prototype, "handleAbsence", null);
exports.SocketListener = SocketListener = SocketListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [socket_gateway_1.AppGateway])
], SocketListener);
//# sourceMappingURL=socket.listener.js.map