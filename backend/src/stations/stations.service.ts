import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Station } from '@prisma/client';

@Injectable()
export class StationsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.StationCreateInput): Promise<Station> {
        return this.prisma.station.create({
            data,
        });
    }

    async findAll(): Promise<Station[]> {
        return this.prisma.station.findMany();
    }

    async findOne(id: string): Promise<Station | null> {
        return this.prisma.station.findUnique({
            where: { id },
        });
    }

    async findByChargePointId(chargePointId: string): Promise<Station | null> {
        return this.prisma.station.findUnique({
            where: { chargePointId },
        });
    }

    async update(id: string, data: Prisma.StationUpdateInput): Promise<Station> {
        return this.prisma.station.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Station> {
        return this.prisma.station.delete({
            where: { id },
        });
    }
}
