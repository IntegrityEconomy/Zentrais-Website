import { Controller, Post, Body, UnauthorizedException,BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaClient, User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}
  private prisma = new PrismaClient();

  @Post('login')
  async login(@Body() body: { username: string; password: string }){
    
    const user = await this.prisma.user.findUnique({
        where: { username: body.username },
        });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await this.authService.validatePassword(body.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const token = await this.authService.signToken(user.id);
    return { token };
  }

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
        where: { username: body.username },
        });
    if (existingUser) throw new BadRequestException('Username already taken');

    // Hash password
    const hashedPassword = await this.authService.hashPassword(body.password);

    // Create user in DB
    
    const newUser = await this.prisma.user.create({data: {
        username: body.username,
        password: hashedPassword,
      },
    });

    // Sign JWT token (optional, for auto-login)
    const token = await this.authService.signToken(newUser.id);

    return { token, user: { id: newUser.id, username: newUser.username } };
  }
}
