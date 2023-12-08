import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './chat/chat.gateway';
import {ChatService} from './chat/chat.service'

@Module({
  imports: [ChatModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway,ChatService],
})
export class AppModule {}
