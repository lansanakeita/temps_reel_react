import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors:true})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Socket;

  constructor(private chatService: ChatService) {} 

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any): Promise<string> {
    console.log("payload avant translate est ", payload.isValidate);
    try {
      if (payload.language) {
        const translatedMessage = await this.chatService.translateMessage(payload.content, payload.language);
  
        // Émettez la traduction au client
        this.server.to(client.id).emit('message', { ...payload, content: translatedMessage, client: client.id });
        
      } 
      else if (payload.isValidate) {
        const validatedMessage = await this.chatService.validateMessage(payload.content);
  
        // émettre la validation au client
        this.server.to(client.id).emit('message', { ...payload, content: validatedMessage, client: client.id });
        console.log("le contenu reçu est  ", payload);
      } 
      else {
        this.server.emit('message', { ...payload, client: client.id });
      }
  
    } catch (error) {
      console.error('Error handling message:', error);
    }
    return 'Hello world!';
  }


  // handleMessage(client: any, payload: any): string {
  //   this.server.emit('message', {...payload, client:client.id});
  //   console.log({payload});
  //   return 'Hello world!';
  // }

  handleConnection(client: any) {
    console.log('client connected', client.id);
  }

  handleDisconnect(client: any) {
    console.log('client deconnected', client.id);
  }
}

