import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}
  private prisma = new PrismaClient();

  @Post('login')
  async login(@Body() body: { email: string; password: string }){
    
    const user = await this.prisma.user.findUnique({
        where: { email: body.email },
        });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await this.authService.validatePassword(body.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const token = await this.authService.signToken(user.id);
    return { token, user: { id: user.id, email: user.email } };
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string; username?: string }) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
        where: { email: body.email },
        });
    if (existingUser) throw new BadRequestException('Email already registered');

    // Hash password
    const hashedPassword = await this.authService.hashPassword(body.password);

    // Generate email_hash for User_PII lookup (simple hash for demo)
    const emailHash = Buffer.from(body.email).toString('base64');

    // Generate a username from email if not provided
    const username = body.username || body.email.split('@')[0];

    // Create user in DB with User_PII
    const newUser = await this.prisma.user.create({
      data: {
        email: body.email,
        email_hash: emailHash,
        username: username,
        password: hashedPassword,
        pii: {
          create: {
            email: body.email,
          },
        },
      },
    });

    // Sign JWT token (optional, for auto-login)
    const token = await this.authService.signToken(newUser.id);

    return { token, user: { id: newUser.id, email: newUser.email } };
  }
}
