import { StationsService } from '../stations/stations.service';
import { TransactionsService } from '../transactions/transactions.service';
export declare class OcppService {
    private stationsService;
    private transactionsService;
    private readonly logger;
    constructor(stationsService: StationsService, transactionsService: TransactionsService);
    handleBootNotification(chargePointId: string, payload: any): Promise<any>;
    handleHeartbeat(chargePointId: string): Promise<any>;
    handleAuthorize(chargePointId: string, payload: any): Promise<any>;
    handleStartTransaction(chargePointId: string, payload: any): Promise<any>;
    handleStopTransaction(chargePointId: string, payload: any): Promise<any>;
    handleStatusNotification(chargePointId: string, payload: any): Promise<any>;
    handleMeterValues(chargePointId: string, payload: any): Promise<any>;
    handleDataTransfer(chargePointId: string, payload: any): Promise<any>;
    sendRemoteStartTransaction(chargePointId: string, idTag: string, connectorId?: number): Promise<any>;
    sendRemoteStopTransaction(chargePointId: string, transactionId: number): Promise<any>;
    sendReset(chargePointId: string, type: 'Hard' | 'Soft'): Promise<any>;
    sendUnlockConnector(chargePointId: string, connectorId: number): Promise<any>;
}
