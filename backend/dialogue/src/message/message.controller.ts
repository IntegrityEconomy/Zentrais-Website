import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
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

  @Get('user/verify/:userId')
  async verifyUser(@Param('userId') userId: string) {
    const user = await this.messageService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { exists: true, userId: user.id, username: user.username };
  }
}

