import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>
  ) {}

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  // NUEVO: busca un usuario por cédula (para evitar duplicados)
  findByCedula(cedula: string) {
    return this.repo.findOne({ where: { cedula } });
  }

  create(data: Partial<User>) {
    return this.repo.save(this.repo.create(data));
  }
}