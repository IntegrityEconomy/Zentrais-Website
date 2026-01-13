import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
//import { UserModule } from '../user/user.module'; 

@Module({
  imports: [
    //UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions : { expiresIn : '7d' }
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService,JwtModule],
})
export class AuthModule {}
