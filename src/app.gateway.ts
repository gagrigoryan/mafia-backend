import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WebSocketServer } from '@nestjs/websockets';

type TClient = {
  id: string;
  name: string;
};

const findClientById = (clients: TClient[], id: string): boolean => {
  for (const client of clients) {
    if (client.id === id) return true;
  }
  return false;
};

@WebSocketGateway(3003, { cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('AppGateway');
  private appClients = [];
  @WebSocketServer() wss;

  afterInit(): any {
    this.logger.log(`Socket server init...`);
  }

  handleConnection(client: Socket) {
    console.log(`${client.id} connected...`);
  }

  handleDisconnect(client: Socket) {
    this.appClients = this.appClients.filter((item) => item.id !== client.id);
    console.log(`${client.id} disconnected...`);
    this.wss.emit('get-clients', {
      data: this.appClients,
    });
  }

  @SubscribeMessage('join')
  handleMessage(client: Socket, name: string) {
    if (findClientById(this.appClients, client.id)) return;
    const newClient: TClient = {
      id: client.id,
      name,
    };
    this.appClients.push(newClient);
    this.wss.emit('get-clients', {
      data: this.appClients,
    });
  }
}
