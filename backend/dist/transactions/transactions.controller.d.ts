import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        stationId: string;
        ocppTransactionId: number | null;
        startTime: Date;
        endTime: Date | null;
        meterStart: number;
        meterStop: number | null;
        totalEnergy: number | null;
        cost: number | null;
        rfidTagId: string | null;
    }[]>;
    findByStationId(stationId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        stationId: string;
        ocppTransactionId: number | null;
        startTime: Date;
        endTime: Date | null;
        meterStart: number;
        meterStop: number | null;
        totalEnergy: number | null;
        cost: number | null;
        rfidTagId: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        stationId: string;
        ocppTransactionId: number | null;
        startTime: Date;
        endTime: Date | null;
        meterStart: number;
        meterStop: number | null;
        totalEnergy: number | null;
        cost: number | null;
        rfidTagId: string | null;
    } | null>;
}
