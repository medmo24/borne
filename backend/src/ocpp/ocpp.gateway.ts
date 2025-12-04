import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { Logger } from '@nestjs/common';
import { OcppService } from './ocpp.service';

interface OcppMessage {
  messageTypeId: number;
  messageId: string;
  action?: string;
  payload?: any;
}

@WebSocketGateway({ path: '/ocpp' })
export class OcppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(OcppGateway.name);
  private clients: Map<string, WebSocket> = new Map();

  constructor(private ocppService: OcppService) { }

  afterInit(server: Server) {
    this.logger.log('🚀 OCPP WebSocket Gateway initialized');
    this.logger.log(`📡 Listening for OCPP connections on path: /ocpp`);
  }

  handleConnection(client: WebSocket, request: any) {
    const fs = require('fs');
    try {
      fs.appendFileSync('connection_logs.txt', `Connection attempt from ${request.url} at ${new Date().toISOString()}\n`);
    } catch (e) {
      console.error('Error writing to log file', e);
    }

    const url = request.url;

    // Only accept connections to /ocpp/* paths
    if (!url.startsWith('/ocpp/') && url !== '/ocpp') {
      this.logger.error(`Rejected connection to invalid path: ${url}`);
      try {
        fs.appendFileSync('connection_logs.txt', `Rejected invalid path: ${url}\n`);
      } catch (e) { }
      client.close();
      return;
    }

    const chargePointId = this.extractChargePointId(url);

    if (!chargePointId) {
      this.logger.error('No chargePointId found in URL');
      try {
        fs.appendFileSync('connection_logs.txt', `No chargePointId found for ${url}\n`);
      } catch (e) { }
      client.close();
      return;
    }

    this.logger.log(`Charge Point ${chargePointId} connected`);
    try {
      fs.appendFileSync('connection_logs.txt', `Charge Point ${chargePointId} connected successfully\n`);
    } catch (e) { }
    this.clients.set(chargePointId, client);

    client.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        await this.handleOcppMessage(chargePointId, message, client);
      } catch (error) {
        this.logger.error(`Error processing message: ${error.message}`);
      }
    });
  }

  handleDisconnect(client: WebSocket) {
    // Find and remove the client
    for (const [chargePointId, ws] of this.clients.entries()) {
      if (ws === client) {
        this.logger.log(`Charge Point ${chargePointId} disconnected`);
        this.clients.delete(chargePointId);
        break;
      }
    }
  }

  private extractChargePointId(url: string): string | null {
    // URL format: /ocpp/CP001 or /ocpp?chargePointId=CP001
    const match = url.match(/\/ocpp\/([^?]+)/);
    if (match) {
      return match[1];
    }

    const urlParams = new URLSearchParams(url.split('?')[1]);
    return urlParams.get('chargePointId');
  }

  private async handleOcppMessage(
    chargePointId: string,
    message: any[],
    client: WebSocket,
  ) {
    const [messageTypeId, messageId, action, payload] = message;

    this.logger.log(
      `Received ${action} from ${chargePointId}: ${JSON.stringify(payload)} `,
    );

    let response: any;

    try {
      switch (action) {
        case 'BootNotification':
          response = await this.ocppService.handleBootNotification(
            chargePointId,
            payload,
          );
          break;

        case 'Heartbeat':
          response = await this.ocppService.handleHeartbeat(chargePointId);
          break;

        case 'Authorize':
          response = await this.ocppService.handleAuthorize(
            chargePointId,
            payload,
          );
          break;

        case 'StartTransaction':
          response = await this.ocppService.handleStartTransaction(
            chargePointId,
            payload,
          );
          break;

        case 'StopTransaction':
          response = await this.ocppService.handleStopTransaction(
            chargePointId,
            payload,
          );
          break;

        case 'StatusNotification':
          response = await this.ocppService.handleStatusNotification(
            chargePointId,
            payload,
          );
          break;

        case 'MeterValues':
          response = await this.ocppService.handleMeterValues(
            chargePointId,
            payload,
          );
          break;

        case 'DataTransfer':
          response = await this.ocppService.handleDataTransfer(
            chargePointId,
            payload,
          );
          break;

        default:
          this.logger.warn(`Unknown action: ${action} `);
          response = { status: 'NotImplemented' };
      }

      // Send OCPP response: [3, messageId, payload]
      const ocppResponse = [3, messageId, response];
      client.send(JSON.stringify(ocppResponse));

      this.logger.log(
        `Sent response to ${chargePointId}: ${JSON.stringify(ocppResponse)} `,
      );
    } catch (error) {
      this.logger.error(`Error handling ${action}: ${error.message} `);

      // Send OCPP error: [4, messageId, errorCode, errorDescription, errorDetails]
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

  // Method to send commands to charge points
  async sendCommand(chargePointId: string, action: string, payload: any): Promise<boolean> {
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

  private generateMessageId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // Get list of connected charge points
  getConnectedChargePoints(): string[] {
    return Array.from(this.clients.keys());
  }
}
