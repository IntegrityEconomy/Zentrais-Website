import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { UploadService } from '../upload/upload.service';

@Module({
  providers: [MessageService,UploadService],
  controllers: [MessageController],
})
export class MessageModule {}
