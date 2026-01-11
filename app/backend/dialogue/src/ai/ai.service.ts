import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * AiService proxies chat requests to the LangGraph Python agent.
 * Set LANGGRAPH_URL env var to point to your deployed LangGraph server.
 * Default: http://localhost:8000 (local dev)
 */
@Injectable()
export class AiService {
  private readonly agentUrl: string;
  private prisma = new PrismaClient();

  constructor() {
    this.agentUrl = (process.env.LANGGRAPH_URL || 'http://localhost:8000').replace(/\/$/, '');
  }

  /**
   * Send a chat message to the LangGraph agent.
   */
  async chat(input: {
    message: string;
    userId: string;
    threadId?: string;
  }): Promise<{
    response: string;
    emotion: { score: number; label: string; reasoning: string };
    threadId: string;
  }> {
    const existingThread = input.threadId
      ? await this.prisma.aiThread.findFirst({
          where: {
            id: input.threadId,
            userId: input.userId,
          },
        })
      : null;

    const res = await fetch(`${this.agentUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: input.message,
        user_id: input.userId,
        thread_id: existingThread?.langgraphThreadId || undefined,
      }),
    });

    const payloadText = await res.text();
    let payload: any = {};
    try {
      payload = payloadText ? JSON.parse(payloadText) : {};
    } catch {
      payload = { raw: payloadText };
    }

    if (!res.ok) {
      const msg =
        payload?.detail ||
        payload?.message ||
        payload?.raw ||
        res.statusText ||
        'LangGraph request failed';
      throw new Error(`LangGraph ${res.status}: ${msg}`);
    }

    const langgraphThreadId = (payload?.thread_id ?? '').toString();
    if (!langgraphThreadId) {
      throw new Error('LangGraph response missing thread_id');
    }

    let thread = existingThread;
    if (!thread) {
      const existingByLanggraph = await this.prisma.aiThread.findUnique({
        where: { langgraphThreadId },
      });

      if (existingByLanggraph && existingByLanggraph.userId !== input.userId) {
        throw new Error('Thread ownership mismatch');
      }

      thread =
        existingByLanggraph ??
        (await this.prisma.aiThread.create({
          data: {
            userId: input.userId,
            langgraphThreadId,
          },
        }));
    }

    const responseText = (payload?.response ?? '').toString();
    const emotion = payload?.emotion ?? { score: 3, label: 'neutral', reasoning: '' };

    await this.prisma.$transaction([
      this.prisma.aiMessage.create({
        data: {
          threadId: thread.id,
          role: 'USER',
          content: input.message,
        },
      }),
      this.prisma.aiMessage.create({
        data: {
          threadId: thread.id,
          role: 'ASSISTANT',
          content: responseText,
          emotionScore:
            typeof emotion?.score === 'number' && Number.isFinite(emotion.score)
              ? Math.trunc(emotion.score)
              : null,
          emotionLabel: typeof emotion?.label === 'string' ? emotion.label : null,
          emotionReasoning: typeof emotion?.reasoning === 'string' ? emotion.reasoning : null,
        },
      }),
    ]);

    return {
      response: responseText,
      emotion,
      threadId: thread.id,
    };
  }

  async listThreads(userId: string) {
    return this.prisma.aiThread.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getThread(userId: string, threadId: string) {
    return this.prisma.aiThread.findFirst({
      where: { id: threadId, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  /**
   * Reset a user's conversation session.
   */
  async reset(input: { userId: string; threadId?: string }): Promise<{ ok: boolean; message: string }> {
    const thread = input.threadId
      ? await this.prisma.aiThread.findFirst({
          where: {
            id: input.threadId,
            userId: input.userId,
          },
        })
      : null;

    const res = await fetch(`${this.agentUrl}/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: input.userId,
        thread_id: thread?.langgraphThreadId || undefined,
      }),
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(payload?.detail || 'Reset failed');
    }
    return { ok: true, message: payload.message || 'Session reset' };
  }
}
