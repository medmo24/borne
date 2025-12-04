import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { OcppService } from './ocpp.service';
export declare class OcppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private ocppService;
    server: Server;
    private readonly logger;
    private clients;
    constructor(ocppService: OcppService);
    afterInit(server: Server): void;
    handleConnection(client: WebSocket, request: any): void;
    handleDisconnect(client: WebSocket): void;
    private extractChargePointId;
    private handleOcppMessage;
    sendCommand(chargePointId: string, action: string, payload: any): Promise<boolean>;
    private generateMessageId;
    getConnectedChargePoints(): string[];
}
