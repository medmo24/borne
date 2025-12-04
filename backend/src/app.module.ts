import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StationsModule } from './stations/stations.module';
import { OcppModule } from './ocpp/ocpp.module';
import { PrismaModule } from './prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StationsModule,
    TransactionsModule,
    OcppModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
