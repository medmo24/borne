import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { OcppGateway } from './ocpp.gateway';

@Controller('ocpp')
export class OcppController {
    constructor(private ocppGateway: OcppGateway) { }

    @Get('connected')
    getConnectedStations() {
        return {
            connectedStations: this.ocppGateway.getConnectedChargePoints(),
            count: this.ocppGateway.getConnectedChargePoints().length,
        };
    }

    @Post('remote-start/:chargePointId')
    async remoteStartTransaction(
        @Param('chargePointId') chargePointId: string,
        @Body() body: { idTag: string; connectorId?: number },
    ) {
        const success = await this.ocppGateway.sendCommand(
            chargePointId,
            'RemoteStartTransaction',
            {
                idTag: body.idTag,
                connectorId: body.connectorId || 1,
            },
        );

        return { success, message: success ? 'Command sent' : 'Station not connected' };
    }

    @Post('remote-stop/:chargePointId')
    async remoteStopTransaction(
        @Param('chargePointId') chargePointId: string,
        @Body() body: { transactionId: number },
    ) {
        const success = await this.ocppGateway.sendCommand(
            chargePointId,
            'RemoteStopTransaction',
            {
                transactionId: body.transactionId,
            },
        );

        return { success, message: success ? 'Command sent' : 'Station not connected' };
    }

    @Post('reset/:chargePointId')
    async reset(
        @Param('chargePointId') chargePointId: string,
        @Body() body: { type: 'Hard' | 'Soft' },
    ) {
        const success = await this.ocppGateway.sendCommand(
            chargePointId,
            'Reset',
            {
                type: body.type || 'Soft',
            },
        );

        return { success, message: success ? 'Command sent' : 'Station not connected' };
    }

    @Post('unlock/:chargePointId')
    async unlockConnector(
        @Param('chargePointId') chargePointId: string,
        @Body() body: { connectorId: number },
    ) {
        const success = await this.ocppGateway.sendCommand(
            chargePointId,
            'UnlockConnector',
            {
                connectorId: body.connectorId || 1,
            },
        );

        return { success, message: success ? 'Command sent' : 'Station not connected' };
    }
}
