import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway(3003, { cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('AppGateway');
  private clientCount = 0;
  @WebSocketServer() wss;

  afterInit(): any {
    this.logger.log(`Socket server init...`);
  }

  handleConnection() {
    this.clientCount++;
    this.wss.emit('client-count', {
      data: this.clientCount,
    });
  }

  handleDisconnect() {
    this.clientCount--;
    this.wss.emit('client-count', {
      data: this.clientCount,
    });
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, text: string): WsResponse<string> {
    return { event: 'client-count', data: '516' };
  }
}
