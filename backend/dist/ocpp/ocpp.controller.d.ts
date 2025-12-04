import { OcppGateway } from './ocpp.gateway';
export declare class OcppController {
    private ocppGateway;
    constructor(ocppGateway: OcppGateway);
    getConnectedStations(): {
        connectedStations: string[];
        count: number;
    };
    remoteStartTransaction(chargePointId: string, body: {
        idTag: string;
        connectorId?: number;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    remoteStopTransaction(chargePointId: string, body: {
        transactionId: number;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    reset(chargePointId: string, body: {
        type: 'Hard' | 'Soft';
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    unlockConnector(chargePointId: string, body: {
        connectorId: number;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
