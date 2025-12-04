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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcppController = void 0;
const common_1 = require("@nestjs/common");
const ocpp_gateway_1 = require("./ocpp.gateway");
let OcppController = class OcppController {
    ocppGateway;
    constructor(ocppGateway) {
        this.ocppGateway = ocppGateway;
    }
    getConnectedStations() {
        return {
            connectedStations: this.ocppGateway.getConnectedChargePoints(),
            count: this.ocppGateway.getConnectedChargePoints().length,
        };
    }
    async remoteStartTransaction(chargePointId, body) {
        const success = await this.ocppGateway.sendCommand(chargePointId, 'RemoteStartTransaction', {
            idTag: body.idTag,
            connectorId: body.connectorId || 1,
        });
        return { success, message: success ? 'Command sent' : 'Station not connected' };
    }
    async remoteStopTransaction(chargePointId, body) {
        const success = await this.ocppGateway.sendCommand(chargePointId, 'RemoteStopTransaction', {
            transactionId: body.transactionId,
        });
        return { success, message: success ? 'Command sent' : 'Station not connected' };
    }
    async reset(chargePointId, body) {
        const success = await this.ocppGateway.sendCommand(chargePointId, 'Reset', {
            type: body.type || 'Soft',
        });
        return { success, message: success ? 'Command sent' : 'Station not connected' };
    }
    async unlockConnector(chargePointId, body) {
        const success = await this.ocppGateway.sendCommand(chargePointId, 'UnlockConnector', {
            connectorId: body.connectorId || 1,
        });
        return { success, message: success ? 'Command sent' : 'Station not connected' };
    }
};
exports.OcppController = OcppController;
__decorate([
    (0, common_1.Get)('connected'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OcppController.prototype, "getConnectedStations", null);
__decorate([
    (0, common_1.Post)('remote-start/:chargePointId'),
    __param(0, (0, common_1.Param)('chargePointId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OcppController.prototype, "remoteStartTransaction", null);
__decorate([
    (0, common_1.Post)('remote-stop/:chargePointId'),
    __param(0, (0, common_1.Param)('chargePointId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OcppController.prototype, "remoteStopTransaction", null);
__decorate([
    (0, common_1.Post)('reset/:chargePointId'),
    __param(0, (0, common_1.Param)('chargePointId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OcppController.prototype, "reset", null);
__decorate([
    (0, common_1.Post)('unlock/:chargePointId'),
    __param(0, (0, common_1.Param)('chargePointId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OcppController.prototype, "unlockConnector", null);
exports.OcppController = OcppController = __decorate([
    (0, common_1.Controller)('ocpp'),
    __metadata("design:paramtypes", [ocpp_gateway_1.OcppGateway])
], OcppController);
//# sourceMappingURL=ocpp.controller.js.map