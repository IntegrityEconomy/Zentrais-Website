import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import {UploadModule} from './upload/upload.module'
import { AiModule } from './ai/ai.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    AuthModule,
    ChatModule,
    MessageModule,
    UploadModule,
    AiModule,
  ],
  controllers:[HealthController],
})
export class AppModule {}
