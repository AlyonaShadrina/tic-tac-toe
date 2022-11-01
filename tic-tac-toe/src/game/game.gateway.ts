import { WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  public readonly server: Server;
}
