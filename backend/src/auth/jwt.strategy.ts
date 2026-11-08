import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from './constants.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // El token llega en el header: Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // un token vencido se rechaza
      secretOrKey: JWT_SECRET, // la misma clave con la que se firmó
    });
  }

  // Se ejecuta solo si la firma es válida. Lo que devuelvas queda en req.user
  validate(payload: { sub: number; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}