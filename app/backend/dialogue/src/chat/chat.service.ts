import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {MessageType} from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ChatService {
  async saveMessage({
    senderId,
    receiverId,
    content,
    type,
    mediaUrl,
  }: {
    senderId: string;
    receiverId: string;
    content?: string;
    type?: 'TEXT' | 'IMAGE' | 'AUDIO';
    mediaUrl?: string;
  }) {
    // const sender = await prisma.user.findUnique({ where: { username: senderId } });
    // if (!sender) throw new Error(`Sender with id ${senderId} does not exist`);

    // Ensure receiver exists
    
    //const receiver = await prisma.user.findUnique({ where: { username: receiverId } });
    //if (!receiver) throw new Error(`Receiver with id ${receiverId} does not exist`);
    return prisma.message.create({
      data: {
        senderId : senderId,
        receiverId : receiverId,
        content,
        type: type as MessageType,
        mediaUrl,
      },
    });
  }

  async getUserId(username: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new Error(`User with username "${username}" not found`);
    }
    return user.id;
  }
   
}
