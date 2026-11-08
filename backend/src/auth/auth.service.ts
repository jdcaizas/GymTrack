import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { LoginDto, RegisterDto } from './auth.dto.js';
import { validarCedulaEcuatoriana } from '../common/cedula.util.js';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    // 1. VALIDACIÓN DE DATO SENSIBLE EN BACK-END (antes de tocar la base de datos)
    if (!validarCedulaEcuatoriana(dto.cedula)) {
      throw new BadRequestException('La cédula ingresada no es válida');
    }

    const exists = await this.users.findByEmail(dto.email);
    if (exists) throw new ConflictException('Ese correo ya está registrado');

    // 2. La cédula tampoco se puede repetir
    const cedulaExists = await this.users.findByCedula(dto.cedula);
    if (cedulaExists) {
      throw new ConflictException('Ya existe un usuario con esa cédula');
    }

    // bcrypt genera un salt aleatorio y devuelve un hash irreversible
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create({
      email: dto.email,
      name: dto.name,
      cedula: dto.cedula,
      passwordHash,
    });

    // Para mostrar en la terminal que NO se guarda la contraseña real
    console.log('\n[REGISTRO] Usuario:', user.email);
    console.log('[REGISTRO] Cédula validada en back-end:', dto.cedula);
    console.log('[REGISTRO] Hash bcrypt guardado:', passwordHash, '\n');

    return this.buildSession(user);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    // compare() hashea lo que escribió el usuario y lo compara con el hash guardado
    const ok = user && (await bcrypt.compare(dto.password, user.passwordHash));
    if (!ok) throw new UnauthorizedException('Correo o contraseña incorrectos');
    return this.buildSession(user);
  }

  private buildSession(user: { id: number; email: string; name: string }) {
    // sub = "subject": el id del usuario dentro del token
    const token = this.jwt.sign({ sub: user.id, email: user.email });
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }
}