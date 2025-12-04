import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { StationsService } from './stations.service';
import { Prisma } from '@prisma/client';

@Controller('stations')
export class StationsController {
    constructor(private readonly stationsService: StationsService) { }

    @Get()
    async findAll() {
        return this.stationsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.stationsService.findOne(id);
    }

    @Post()
    async create(@Body() createStationDto: Prisma.StationCreateInput) {
        return this.stationsService.create(createStationDto);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateStationDto: Prisma.StationUpdateInput,
    ) {
        return this.stationsService.update(id, updateStationDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.stationsService.remove(id);
    }
}
