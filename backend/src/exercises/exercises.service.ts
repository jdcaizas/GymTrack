import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity.js';
import { ExerciseDto } from './exercise.dto.js';
import { Muscle } from '../catalog/muscle.entity.js';

@Injectable()
export class ExercisesService {
  constructor(@InjectRepository(Exercise) private repo: Repository<Exercise>) {}

  // Back-end: el músculo debe existir en la tabla de músculos
  private async assertMuscle(muscleId: number) {
    const muscle = await this.repo.manager.findOneBy(Muscle, { id: muscleId });
    if (!muscle) throw new BadRequestException('El músculo seleccionado no existe');
  }

  // Leer: solo los ejercicios de este usuario, el más nuevo primero
  findAll(userId: number) {
    return this.repo.find({ where: { userId }, order: { id: 'DESC' } });
  }

  // Crear: el userId viene del token, NO del cuerpo de la petición
  async create(userId: number, dto: ExerciseDto) {
    await this.assertMuscle(dto.muscleId);
    const saved = await this.repo.save(this.repo.create({ ...dto, userId }));
    return this.repo.findOne({ where: { id: saved.id } });
  }

  // Actualizar: se busca por id Y por userId, así nadie edita lo ajeno
  async update(userId: number, id: number, dto: ExerciseDto) {
    const item = await this.repo.findOne({ where: { id, userId } });
    if (!item) throw new NotFoundException('Ejercicio no encontrado');
    await this.assertMuscle(dto.muscleId);
    await this.repo.update({ id, userId }, dto);
    return this.repo.findOne({ where: { id, userId } });
  }

  async remove(userId: number, id: number) {
    const item = await this.repo.findOne({ where: { id, userId } });
    if (!item) throw new NotFoundException('Ejercicio no encontrado');
    await this.repo.remove(item);
    return { deleted: true };
  }
}