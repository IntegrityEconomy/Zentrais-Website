import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly jwt: JwtService,
  ) {}

  private getUserIdFromRequest(req: any): string {
    const authHeader = req?.headers?.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.slice(7);
    let payload: any;
    try {
      payload = this.jwt.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    const userId = (payload?.userId ?? '').toString().trim();
    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return userId;
  }

  @Get('threads')
  async listThreads(@Req() req: any) {
    const userId = this.getUserIdFromRequest(req);
    const threads = await this.aiService.listThreads(userId);
    return { ok: true, threads };
  }

  @Get('threads/:threadId')
  async getThread(@Param('threadId') threadId: string, @Req() req: any) {
    const userId = this.getUserIdFromRequest(req);
    const thread = await this.aiService.getThread(userId, threadId);
    if (!thread) {
      throw new BadRequestException('Thread not found');
    }
    return { ok: true, thread };
  }

  /**
   * POST /ai/chat - send a message to the LangGraph agent.
   */
  @Post('chat')
  async chat(
    @Body()
    body: {
      message?: string;
      threadId?: string;
    },
    @Req() req: any,
  ) {
    const userId = this.getUserIdFromRequest(req);
    const message = (body?.message ?? '').trim();
    if (!message) {
      throw new BadRequestException('Missing message');
    }

    try {
      const result = await this.aiService.chat({
        message,
        userId,
        threadId: (body?.threadId ?? '').trim() || undefined,
      });

      return { ok: true, ...result };
    } catch (err: any) {
      const msg = err?.message || 'AI request failed';
      console.error('[AI] /ai/chat failed:', msg);
      throw new InternalServerErrorException(msg);
    }
  }

  /**
   * POST /ai/reset - reset a user's conversation session.
   */
  @Post('reset')
  async reset(
    @Body() body: { threadId?: string },
    @Req() req: any,
  ) {
    const userId = this.getUserIdFromRequest(req);

    try {
      return await this.aiService.reset({
        userId,
        threadId: (body?.threadId ?? '').trim() || undefined,
      });
    } catch (err: any) {
      const msg = err?.message || 'Reset failed';
      console.error('[AI] /ai/reset failed:', msg);
      throw new InternalServerErrorException(msg);
    }
  }
}
