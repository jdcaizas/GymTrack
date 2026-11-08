import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './jwt.strategy.js';
import { JWT_SECRET } from './constants.js';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // expiresIn en segundos: 7200 = 2 horas
    JwtModule.register({ secret: JWT_SECRET, signOptions: { expiresIn: 7200 } }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}