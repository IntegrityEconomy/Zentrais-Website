import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { UploadService } from '../upload/upload.service';
@Module({
  providers: [ChatService, ChatGateway, UploadService],
  imports: [AuthModule],
  exports: [ChatService],
})
export class ChatModule {}
