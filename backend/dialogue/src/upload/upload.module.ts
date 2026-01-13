import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ChatService } from '../chat/chat.service'; // adjust path
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UploadController],
  providers: [UploadService, ChatService],
  exports: [UploadService],
})
export class UploadModule {}
