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
    try {
      if (payload.language) {
        const translatedMessage = await this.chatService.translateMessage(payload.content, payload.language);
        this.server.to(client.id).emit('message', { ...payload, content: translatedMessage, client: client.id });
        console.log("le contenu reçu pour la traduction est  ", payload);
      } 
      else if (payload.isValidate) {
        const validatedMessage = await this.chatService.validateMessage(payload.content);
        this.server.to(client.id).emit('message', { ...payload, content: validatedMessage, client: client.id });
        console.log("le contenu reçu pour la validation est  ", payload);
      }
      else if (payload.isSuggestion) {
        console.log("le contenu send en suggestion  ", payload);
        const suggestiondMessage = await this.chatService.suggestionMessages(payload.content);
        this.server.to(client.id).emit('message', { ...payload, content: suggestiondMessage, client: client.id });
        console.log("le contenu reçu en suggestion  ", payload);
      } 
      else {
        this.server.emit('message', { ...payload, client: client.id });
      }
  
    } catch (error) {
      console.error('Error handling message:', error);
    }
    return 'Hello world!';
  }

  handleConnection(client: any) {
    console.log('client connected', client.id);
  }

  handleDisconnect(client: any) {
    console.log('client deconnected', client.id);
  }
}

