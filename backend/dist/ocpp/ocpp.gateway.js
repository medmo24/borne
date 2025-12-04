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
var OcppGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcppGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const ws_1 = require("ws");
const common_1 = require("@nestjs/common");
const ocpp_service_1 = require("./ocpp.service");
let OcppGateway = OcppGateway_1 = class OcppGateway {
    ocppService;
    server;
    logger = new common_1.Logger(OcppGateway_1.name);
    clients = new Map();
    constructor(ocppService) {
        this.ocppService = ocppService;
    }
    afterInit(server) {
        this.logger.log('🚀 OCPP WebSocket Gateway initialized');
        this.logger.log(`📡 Listening for OCPP connections on path: /ocpp`);
    }
    handleConnection(client, request) {
        const fs = require('fs');
        try {
            fs.appendFileSync('connection_logs.txt', `Connection attempt from ${request.url} at ${new Date().toISOString()}\n`);
        }
        catch (e) {
            console.error('Error writing to log file', e);
        }
        const url = request.url;
        if (!url.startsWith('/ocpp/') && url !== '/ocpp') {
            this.logger.error(`Rejected connection to invalid path: ${url}`);
            try {
                fs.appendFileSync('connection_logs.txt', `Rejected invalid path: ${url}\n`);
            }
            catch (e) { }
            client.close();
            return;
        }
        const chargePointId = this.extractChargePointId(url);
        if (!chargePointId) {
            this.logger.error('No chargePointId found in URL');
            try {
                fs.appendFileSync('connection_logs.txt', `No chargePointId found for ${url}\n`);
            }
            catch (e) { }
            client.close();
            return;
        }
        this.logger.log(`Charge Point ${chargePointId} connected`);
        try {
            fs.appendFileSync('connection_logs.txt', `Charge Point ${chargePointId} connected successfully\n`);
        }
        catch (e) { }
        this.clients.set(chargePointId, client);
        client.on('message', async (data) => {
            try {
                const message = JSON.parse(data.toString());
                await this.handleOcppMessage(chargePointId, message, client);
            }
            catch (error) {
                this.logger.error(`Error processing message: ${error.message}`);
            }
        });
    }
    handleDisconnect(client) {
        for (const [chargePointId, ws] of this.clients.entries()) {
            if (ws === client) {
                this.logger.log(`Charge Point ${chargePointId} disconnected`);
                this.clients.delete(chargePointId);
                break;
            }
        }
    }
    extractChargePointId(url) {
        const match = url.match(/\/ocpp\/([^?]+)/);
        if (match) {
            return match[1];
        }
        const urlParams = new URLSearchParams(url.split('?')[1]);
        return urlParams.get('chargePointId');
    }
    async handleOcppMessage(chargePointId, message, client) {
        const [messageTypeId, messageId, action, payload] = message;
        this.logger.log(`Received ${action} from ${chargePointId}: ${JSON.stringify(payload)} `);
        let response;
        try {
            switch (action) {
                case 'BootNotification':
                    response = await this.ocppService.handleBootNotification(chargePointId, payload);
                    break;
                case 'Heartbeat':
                    response = await this.ocppService.handleHeartbeat(chargePointId);
                    break;
                case 'Authorize':
                    response = await this.ocppService.handleAuthorize(chargePointId, payload);
                    break;
                case 'StartTransaction':
                    response = await this.ocppService.handleStartTransaction(chargePointId, payload);
                    break;
                case 'StopTransaction':
                    response = await this.ocppService.handleStopTransaction(chargePointId, payload);
                    break;
                case 'StatusNotification':
                    response = await this.ocppService.handleStatusNotification(chargePointId, payload);
                    break;
                case 'MeterValues':
                    response = await this.ocppService.handleMeterValues(chargePointId, payload);
                    break;
                case 'DataTransfer':
                    response = await this.ocppService.handleDataTransfer(chargePointId, payload);
                    break;
                default:
                    this.logger.warn(`Unknown action: ${action} `);
                    response = { status: 'NotImplemented' };
            }
            const ocppResponse = [3, messageId, response];
            client.send(JSON.stringify(ocppResponse));
            this.logger.log(`Sent response to ${chargePointId}: ${JSON.stringify(ocppResponse)} `);
        }
        catch (error) {
            this.logger.error(`Error handling ${action}: ${error.message} `);
            const ocppError = [
                4,
                messageId,
                'InternalError',
                error.message,
                {},
            ];
            client.send(JSON.stringify(ocppError));
        }
    }
    async sendCommand(chargePointId, action, payload) {
        const client = this.clients.get(chargePointId);
        if (!client) {
            this.logger.error(`Charge Point ${chargePointId} not connected`);
            return false;
        }
        const messageId = this.generateMessageId();
        const message = [2, messageId, action, payload];
        client.send(JSON.stringify(message));
        this.logger.log(`Sent ${action} to ${chargePointId} `);
        return true;
    }
    generateMessageId() {
        return Math.random().toString(36).substring(2, 15);
    }
    getConnectedChargePoints() {
        return Array.from(this.clients.keys());
    }
};
exports.OcppGateway = OcppGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", ws_1.Server)
], OcppGateway.prototype, "server", void 0);
exports.OcppGateway = OcppGateway = OcppGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ path: '/ocpp' }),
    __metadata("design:paramtypes", [ocpp_service_1.OcppService])
], OcppGateway);
//# sourceMappingURL=ocpp.gateway.js.map