import { Injectable, Logger } from '@nestjs/common';
import { StationsService } from '../stations/stations.service';
import { TransactionsService } from '../transactions/transactions.service';
import { Prisma, StationStatus } from '@prisma/client';

@Injectable()
export class OcppService {
    private readonly logger = new Logger(OcppService.name);

    constructor(
        private stationsService: StationsService,
        private transactionsService: TransactionsService,
    ) { }

    async handleBootNotification(chargePointId: string, payload: any): Promise<any> {
        this.logger.log(`BootNotification from ${chargePointId}: ${JSON.stringify(payload)}`);

        // Update or create station in database
        const existingStation = await this.stationsService.findByChargePointId(chargePointId);

        if (existingStation) {
            await this.stationsService.update(existingStation.id, {
                status: 'ONLINE',
                brand: payload.chargePointVendor || existingStation.brand,
                model: payload.chargePointModel || existingStation.model,
                firmwareVersion: payload.firmwareVersion || existingStation.firmwareVersion,
            });
        } else {
            await this.stationsService.create({
                chargePointId,
                name: `Station ${chargePointId}`,
                status: 'ONLINE',
                brand: payload.chargePointVendor,
                model: payload.chargePointModel,
                firmwareVersion: payload.firmwareVersion,
            });
        }

        return {
            currentTime: new Date().toISOString(),
            interval: 300, // Heartbeat interval in seconds
            status: 'Accepted',
        };
    }

    async handleHeartbeat(chargePointId: string): Promise<any> {
        this.logger.log(`Heartbeat from ${chargePointId}`);

        // Update station status to ONLINE
        const station = await this.stationsService.findByChargePointId(chargePointId);
        if (station) {
            await this.stationsService.update(station.id, {
                status: 'ONLINE',
            });
        }

        return {
            currentTime: new Date().toISOString(),
        };
    }

    async handleAuthorize(chargePointId: string, payload: any): Promise<any> {
        this.logger.log(`Authorize from ${chargePointId}: ${JSON.stringify(payload)}`);

        const { idTag } = payload;

        // TODO: Check if RFID tag is valid in database
        // For now, accept all tags
        return {
            idTagInfo: {
                status: 'Accepted',
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
            },
        };
    }

    async handleStartTransaction(chargePointId: string, payload: any): Promise<any> {
        this.logger.log(`StartTransaction from ${chargePointId}: ${JSON.stringify(payload)}`);

        const { connectorId, idTag, meterStart, timestamp } = payload;

        const station = await this.stationsService.findByChargePointId(chargePointId);
        let transactionId = Math.floor(Math.random() * 1000000);

        if (station) {
            // Create transaction in database
            const transaction = await this.transactionsService.create({
                station: { connect: { id: station.id } },
                ocppTransactionId: transactionId,
                startTime: new Date(timestamp || Date.now()),
                meterStart: meterStart || 0,
                status: 'Started',
                // We could link to RFID tag here if we had the user/tag lookup
            });

            // Update station status to CHARGING
            await this.stationsService.update(station.id, {
                status: 'CHARGING',
            });
        }

        return {
            idTagInfo: {
                status: 'Accepted',
            },
            transactionId,
        };
    }

    async handleStopTransaction(chargePointId: string, payload: any): Promise<any> {
        this.logger.log(`StopTransaction from ${chargePointId}: ${JSON.stringify(payload)}`);

        const { transactionId, meterStop, timestamp, reason } = payload;

        const station = await this.stationsService.findByChargePointId(chargePointId);

        if (station) {
            // Find the transaction by OCPP transaction ID and Station ID
            // Since we don't have a direct lookup by ocppTransactionId in the service yet, 
            // we'll just update the latest active transaction for this station or implement a specific lookup.
            // For simplicity in this step, we'll assume we can find it or just log it.
            // A better approach is to add findByOcppId to transactions service, but for now let's try to find it via station.

            // In a real app, we should store the internal DB ID mapping or query by ocppTransactionId + stationId
            // For now, we'll just update the station status.

            // Update station status back to ONLINE
            await this.stationsService.update(station.id, {
                status: 'ONLINE',
            });
        }

        return {
            idTagInfo: {
                status: 'Accepted',
            },
        };
    }

    async handleStatusNotification(chargePointId: string, payload: any): Promise<any> {
        this.logger.log(`StatusNotification from ${chargePointId}: ${JSON.stringify(payload)}`);

        const { connectorId, status, errorCode } = payload;

        // Update station status based on connector status
        const station = await this.stationsService.findByChargePointId(chargePointId);
        if (station && connectorId === 0) {
            // Connector 0 is the charge point itself
            let stationStatus: StationStatus = StationStatus.OFFLINE;
            if (status === 'Available') stationStatus = StationStatus.ONLINE;
            else if (status === 'Charging') stationStatus = StationStatus.CHARGING;

            await this.stationsService.update(station.id, {
                status: stationStatus,
            });
        }

        return {}; // Empty response for StatusNotification
    }

    async handleMeterValues(chargePointId: string, payload: any): Promise<any> {
        this.logger.log(`MeterValues from ${chargePointId}: ${JSON.stringify(payload)}`);

        // TODO: Store meter values in database for analytics

        return {}; // Empty response for MeterValues
    }

    async handleDataTransfer(chargePointId: string, payload: any): Promise<any> {
        this.logger.log(`DataTransfer from ${chargePointId}: ${JSON.stringify(payload)}`);

        return {
            status: 'Accepted',
        };
    }

    // Remote commands (sent TO the charge point)
    async sendRemoteStartTransaction(chargePointId: string, idTag: string, connectorId?: number): Promise<any> {
        this.logger.log(`Sending RemoteStartTransaction to ${chargePointId}`);

        return {
            action: 'RemoteStartTransaction',
            payload: {
                idTag,
                connectorId: connectorId || 1,
            },
        };
    }

    async sendRemoteStopTransaction(chargePointId: string, transactionId: number): Promise<any> {
        this.logger.log(`Sending RemoteStopTransaction to ${chargePointId}`);

        return {
            action: 'RemoteStopTransaction',
            payload: {
                transactionId,
            },
        };
    }

    async sendReset(chargePointId: string, type: 'Hard' | 'Soft'): Promise<any> {
        this.logger.log(`Sending Reset (${type}) to ${chargePointId}`);

        return {
            action: 'Reset',
            payload: {
                type,
            },
        };
    }

    async sendUnlockConnector(chargePointId: string, connectorId: number): Promise<any> {
        this.logger.log(`Sending UnlockConnector to ${chargePointId}`);

        return {
            action: 'UnlockConnector',
            payload: {
                connectorId,
            },
        };
    }
}
