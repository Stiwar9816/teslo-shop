import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets/interfaces';
import { Server, Socket } from 'socket.io';
import { NewMessage } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService
  ) { }

  async handleConnection(client: Socket) {

    const token = client.handshake.headers.authentication as string
    let payload: JwtPayload

    try {
      payload = this.jwtService.verify(token)
      await this.messageWsService.registerClient(client, payload.id)
    } catch (error) {
      client.disconnect()
      return
    }

    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients())
  }
  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id)
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients())
  }

  @SubscribeMessage('message-form-clients')
  async handleMessageFromClient(client: Socket, payload: NewMessage) {
    console.log(client.id, payload)

    //emite unicamente al cliente que envia el mensaje
    // client.emit('message-from-server',{
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'No message!!'
    // })

    //Emite a todos, Menos al cliente que envia el mensaje
    // client.broadcast.emit('message-from-server',{
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'No message!!'
    // })

    //Emite el mensaje a todos los conectados
    this.wss.emit('message-from-server', {
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'No message!!'
    })

  }
}
