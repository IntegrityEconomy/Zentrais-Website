import { Controller, Get, Param , Query } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get(':userId')
  async getUserMessages(@Param('userId') userId: string) {
    return this.messageService.getUserMessages(userId);
  }
  @Get('chats/:userId')
  async getChatList(@Param('userId') userId: string) {
    return this.messageService.getChatList(userId);
  }
}

