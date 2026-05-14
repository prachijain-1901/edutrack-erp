import { AppGateway } from './socket.gateway';
export declare class SocketListener {
    private readonly gateway;
    private readonly logger;
    constructor(gateway: AppGateway);
    handleAnyEvent(event: string | string[], payload: any): void;
    handlePayment(payload: any): void;
    handleAbsence(payload: any): void;
}
