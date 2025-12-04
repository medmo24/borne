import { Module } from '@nestjs/common';
import { OcppService } from './ocpp.service';
import { OcppGateway } from './ocpp.gateway';
import { OcppController } from './ocpp.controller';
import { StationsModule } from '../stations/stations.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [StationsModule, TransactionsModule],
  controllers: [OcppController],
  providers: [OcppService, OcppGateway],
  exports: [OcppGateway],
})
export class OcppModule { }
