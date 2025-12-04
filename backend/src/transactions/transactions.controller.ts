import { Controller, Get, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Get()
    findAll() {
        return this.transactionsService.findAll();
    }

    @Get('station/:stationId')
    findByStationId(@Param('stationId') stationId: string) {
        return this.transactionsService.findByStationId(stationId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.transactionsService.findOne(id);
    }
}
