import { Controller, Post, UploadedFile, UseInterceptors, Body, BadRequestException, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
//import { ChatGateway } from '../chat/chat.gateway';
import { ChatService } from '../chat/chat.service'; // remove later when sending through recieverId not name
import { JwtService } from '@nestjs/jwt';
import { InternalServerErrorException } from '@nestjs/common';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService,
              private chatService: ChatService,
              private readonly jwtService: JwtService,
            ) {}

  @Post('media')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
  @UploadedFile() file,
  @Body() body: { receiverId: string; type: 'IMAGE' | 'AUDIO' },
  @Req() req: any,
) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new BadRequestException('Authorization header missing');

    const token = authHeader.replace('Bearer ', '');
    const payload = this.jwtService.verify(token); // decode JWT
    const senderId = payload.userId; // ✅ secure sender
    const receiverId=body.receiverId;
    //const receiverId = await this.chatService.getUserId(body.receiverId);

    const url = await this.uploadService.uploadFile(file, senderId, receiverId, body.type);

    // Return only the key, no presigned URL
    return {
      mediaKey: url.key,
    };
  } catch (err) {
    // Handle JWT errors separately if you want
    if (err instanceof BadRequestException) {
      throw err;
    }

    // Other errors
    console.error('Failed to upload media:', err);
    throw new InternalServerErrorException('Media upload failed');
  }
}

}
