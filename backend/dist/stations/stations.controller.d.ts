import { StationsService } from './stations.service';
import { Prisma } from '@prisma/client';
export declare class StationsController {
    private readonly stationsService;
    constructor(stationsService: StationsService);
    findAll(): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        chargePointId: string;
        brand: string | null;
        model: string | null;
        serialNumber: string | null;
        firmwareVersion: string | null;
        status: import(".prisma/client").$Enums.StationStatus;
        lastHeartbeat: Date | null;
        ipAddress: string | null;
    }[]>;
    findOne(id: string): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        chargePointId: string;
        brand: string | null;
        model: string | null;
        serialNumber: string | null;
        firmwareVersion: string | null;
        status: import(".prisma/client").$Enums.StationStatus;
        lastHeartbeat: Date | null;
        ipAddress: string | null;
    } | null>;
    create(createStationDto: Prisma.StationCreateInput): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        chargePointId: string;
        brand: string | null;
        model: string | null;
        serialNumber: string | null;
        firmwareVersion: string | null;
        status: import(".prisma/client").$Enums.StationStatus;
        lastHeartbeat: Date | null;
        ipAddress: string | null;
    }>;
    update(id: string, updateStationDto: Prisma.StationUpdateInput): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        chargePointId: string;
        brand: string | null;
        model: string | null;
        serialNumber: string | null;
        firmwareVersion: string | null;
        status: import(".prisma/client").$Enums.StationStatus;
        lastHeartbeat: Date | null;
        ipAddress: string | null;
    }>;
    remove(id: string): Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        chargePointId: string;
        brand: string | null;
        model: string | null;
        serialNumber: string | null;
        firmwareVersion: string | null;
        status: import(".prisma/client").$Enums.StationStatus;
        lastHeartbeat: Date | null;
        ipAddress: string | null;
    }>;
}
