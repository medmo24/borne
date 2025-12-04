import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Transaction } from '@prisma/client';

@Injectable()
export class TransactionsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.TransactionCreateInput): Promise<Transaction> {
        return this.prisma.transaction.create({
            data,
        });
    }

    async findAll(): Promise<Transaction[]> {
        return this.prisma.transaction.findMany({
            include: {
                station: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findByStationId(stationId: string): Promise<Transaction[]> {
        return this.prisma.transaction.findMany({
            where: {
                stationId,
            },
            include: {
                station: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string): Promise<Transaction | null> {
        return this.prisma.transaction.findUnique({
            where: { id },
            include: {
                station: true,
            },
        });
    }

    async update(id: string, data: Prisma.TransactionUpdateInput): Promise<Transaction> {
        return this.prisma.transaction.update({
            where: { id },
            data,
        });
    }
}
