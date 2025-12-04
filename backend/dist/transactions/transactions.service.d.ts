import { PrismaService } from '../prisma.service';
import { Prisma, Transaction } from '@prisma/client';
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.TransactionCreateInput): Promise<Transaction>;
    findAll(): Promise<Transaction[]>;
    findByStationId(stationId: string): Promise<Transaction[]>;
    findOne(id: string): Promise<Transaction | null>;
    update(id: string, data: Prisma.TransactionUpdateInput): Promise<Transaction>;
}
