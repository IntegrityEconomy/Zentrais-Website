import { Controller, Post, Body, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
    try {
      const user = await this.prisma.user.findUnique({
          where: { email: body.email },
          });

      if (!user) throw new UnauthorizedException('Invalid email or password');

      const isValid = await this.authService.validatePassword(body.password, user.password);
      if (!isValid) throw new UnauthorizedException('Invalid email or password');

      const token = await this.authService.signToken(user.id);
      return { token, user: { id: user.id, email: user.email } };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      console.error('Login error:', error);
      throw new InternalServerErrorException(`Login failed: ${error.message || 'Database error'}`);
    }
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string; username?: string }) {
    try {
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
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.error('Registration error:', error);
      
      // Handle Prisma unique constraint errors
      if (error.code === 'P2002') {
        throw new BadRequestException('Email already registered');
      }
      
      throw new InternalServerErrorException(`Registration failed: ${error.message || 'Database error'}`);
    }
  }
}
