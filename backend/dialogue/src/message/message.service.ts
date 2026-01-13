import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UploadService } from '../upload/upload.service';

const prisma = new PrismaClient();

@Injectable()
export class MessageService {
  constructor(private readonly uploadService: UploadService) {}

  async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, email: true },
    });
  }

  async getUserMessages(userId: string) {
    // Fetch messages from database
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Add presigned URL for media messages
    const mappedMessages = await Promise.all(
      messages.map(async (msg) => {
        if (msg.mediaUrl) {
          msg.mediaUrl = await this.uploadService.getPresignedUrl(msg.mediaUrl);
          return { ...msg };
        }
        return msg;
      })
    );

    return mappedMessages;
  }

  async getChatList(userId: string) {
    // 1. Fetch all messages involving this user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      orderBy: {
        createdAt: 'desc', // latest messages first
      },
    });

    if (!messages || messages.length === 0) return [];

    // 2. Reduce to latest message per chat user
    const chatMap = new Map<string, typeof messages[0]>();

    for (const msg of messages) {
      const chatUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!chatMap.has(chatUserId)) {
        chatMap.set(chatUserId, msg);
      }
    }

    // 3. Fetch usernames in bulk
    const chatUserIds = Array.from(chatMap.keys());
    const users = await prisma.user.findMany({
      where: { id: { in: chatUserIds } },
      select: { id: true, username: true },
    });

    // 4. Map to chat list format
    const chatList = Array.from(chatMap.values()).map((msg) => {
      const chatUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const chatUser = users.find((u) => u.id === chatUserId);

      // For UI: show "Image" or "Audio" instead of raw content
      let lastMessage = msg.content;
      if (msg.type === 'IMAGE') lastMessage = 'Image';
      if (msg.type === 'AUDIO') lastMessage = 'Audio';

      return {
        chatUserId,
        chatUsername: chatUser?.username || 'Unknown',
        lastMessage,
        lastMessageType: msg.type,
        lastMessageTime: msg.createdAt,
      };
    });

    return chatList;
  }
}


