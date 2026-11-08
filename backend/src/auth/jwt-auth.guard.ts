import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Si no hay token válido, responde 401 automáticamente
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}