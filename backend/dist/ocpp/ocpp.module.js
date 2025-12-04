"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcppModule = void 0;
const common_1 = require("@nestjs/common");
const ocpp_service_1 = require("./ocpp.service");
const ocpp_gateway_1 = require("./ocpp.gateway");
const ocpp_controller_1 = require("./ocpp.controller");
const stations_module_1 = require("../stations/stations.module");
const transactions_module_1 = require("../transactions/transactions.module");
let OcppModule = class OcppModule {
};
exports.OcppModule = OcppModule;
exports.OcppModule = OcppModule = __decorate([
    (0, common_1.Module)({
        imports: [stations_module_1.StationsModule, transactions_module_1.TransactionsModule],
        controllers: [ocpp_controller_1.OcppController],
        providers: [ocpp_service_1.OcppService, ocpp_gateway_1.OcppGateway],
        exports: [ocpp_gateway_1.OcppGateway],
    })
], OcppModule);
//# sourceMappingURL=ocpp.module.js.map