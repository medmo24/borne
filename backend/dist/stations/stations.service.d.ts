import { PrismaService } from '../prisma.service';
import { Prisma, Station } from '@prisma/client';
export declare class StationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.StationCreateInput): Promise<Station>;
    findAll(): Promise<Station[]>;
    findOne(id: string): Promise<Station | null>;
    findByChargePointId(chargePointId: string): Promise<Station | null>;
    update(id: string, data: Prisma.StationUpdateInput): Promise<Station>;
    remove(id: string): Promise<Station>;
}
