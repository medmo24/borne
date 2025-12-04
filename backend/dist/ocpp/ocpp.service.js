"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OcppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcppService = void 0;
const common_1 = require("@nestjs/common");
const stations_service_1 = require("../stations/stations.service");
const transactions_service_1 = require("../transactions/transactions.service");
const client_1 = require("@prisma/client");
let OcppService = OcppService_1 = class OcppService {
    stationsService;
    transactionsService;
    logger = new common_1.Logger(OcppService_1.name);
    constructor(stationsService, transactionsService) {
        this.stationsService = stationsService;
        this.transactionsService = transactionsService;
    }
    async handleBootNotification(chargePointId, payload) {
        this.logger.log(`BootNotification from ${chargePointId}: ${JSON.stringify(payload)}`);
        const existingStation = await this.stationsService.findByChargePointId(chargePointId);
        if (existingStation) {
            await this.stationsService.update(existingStation.id, {
                status: 'ONLINE',
                brand: payload.chargePointVendor || existingStation.brand,
                model: payload.chargePointModel || existingStation.model,
                firmwareVersion: payload.firmwareVersion || existingStation.firmwareVersion,
            });
        }
        else {
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
            interval: 300,
            status: 'Accepted',
        };
    }
    async handleHeartbeat(chargePointId) {
        this.logger.log(`Heartbeat from ${chargePointId}`);
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
    async handleAuthorize(chargePointId, payload) {
        this.logger.log(`Authorize from ${chargePointId}: ${JSON.stringify(payload)}`);
        const { idTag } = payload;
        return {
            idTagInfo: {
                status: 'Accepted',
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            },
        };
    }
    async handleStartTransaction(chargePointId, payload) {
        this.logger.log(`StartTransaction from ${chargePointId}: ${JSON.stringify(payload)}`);
        const { connectorId, idTag, meterStart, timestamp } = payload;
        const station = await this.stationsService.findByChargePointId(chargePointId);
        let transactionId = Math.floor(Math.random() * 1000000);
        if (station) {
            const transaction = await this.transactionsService.create({
                station: { connect: { id: station.id } },
                ocppTransactionId: transactionId,
                startTime: new Date(timestamp || Date.now()),
                meterStart: meterStart || 0,
                status: 'Started',
            });
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
    async handleStopTransaction(chargePointId, payload) {
        this.logger.log(`StopTransaction from ${chargePointId}: ${JSON.stringify(payload)}`);
        const { transactionId, meterStop, timestamp, reason } = payload;
        const station = await this.stationsService.findByChargePointId(chargePointId);
        if (station) {
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
    async handleStatusNotification(chargePointId, payload) {
        this.logger.log(`StatusNotification from ${chargePointId}: ${JSON.stringify(payload)}`);
        const { connectorId, status, errorCode } = payload;
        const station = await this.stationsService.findByChargePointId(chargePointId);
        if (station && connectorId === 0) {
            let stationStatus = client_1.StationStatus.OFFLINE;
            if (status === 'Available')
                stationStatus = client_1.StationStatus.ONLINE;
            else if (status === 'Charging')
                stationStatus = client_1.StationStatus.CHARGING;
            await this.stationsService.update(station.id, {
                status: stationStatus,
            });
        }
        return {};
    }
    async handleMeterValues(chargePointId, payload) {
        this.logger.log(`MeterValues from ${chargePointId}: ${JSON.stringify(payload)}`);
        return {};
    }
    async handleDataTransfer(chargePointId, payload) {
        this.logger.log(`DataTransfer from ${chargePointId}: ${JSON.stringify(payload)}`);
        return {
            status: 'Accepted',
        };
    }
    async sendRemoteStartTransaction(chargePointId, idTag, connectorId) {
        this.logger.log(`Sending RemoteStartTransaction to ${chargePointId}`);
        return {
            action: 'RemoteStartTransaction',
            payload: {
                idTag,
                connectorId: connectorId || 1,
            },
        };
    }
    async sendRemoteStopTransaction(chargePointId, transactionId) {
        this.logger.log(`Sending RemoteStopTransaction to ${chargePointId}`);
        return {
            action: 'RemoteStopTransaction',
            payload: {
                transactionId,
            },
        };
    }
    async sendReset(chargePointId, type) {
        this.logger.log(`Sending Reset (${type}) to ${chargePointId}`);
        return {
            action: 'Reset',
            payload: {
                type,
            },
        };
    }
    async sendUnlockConnector(chargePointId, connectorId) {
        this.logger.log(`Sending UnlockConnector to ${chargePointId}`);
        return {
            action: 'UnlockConnector',
            payload: {
                connectorId,
            },
        };
    }
};
exports.OcppService = OcppService;
exports.OcppService = OcppService = OcppService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [stations_service_1.StationsService,
        transactions_service_1.TransactionsService])
], OcppService);
//# sourceMappingURL=ocpp.service.js.map