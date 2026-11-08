import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MuscleGroup } from './muscle-group.entity.js';
import { Muscle } from './muscle.entity.js';

// Datos iniciales (seed): se cargan solos si la tabla está vacía
const SEED: Record<string, string[]> = {
  Pecho: ['Pectoral superior', 'Pectoral medio', 'Pectoral inferior'],
  Espalda: ['Dorsal ancho', 'Trapecio', 'Romboides', 'Lumbar'],
  Pierna: ['Cuádriceps', 'Isquiotibiales', 'Glúteos', 'Pantorrillas'],
  Hombro: ['Deltoides anterior', 'Deltoides lateral', 'Deltoides posterior'],
  Brazo: ['Bíceps', 'Tríceps', 'Antebrazo'],
  Core: ['Recto abdominal', 'Oblicuos', 'Transverso'],
};

@Injectable()
export class CatalogService implements OnModuleInit {
  constructor(
    @InjectRepository(MuscleGroup) private groups: Repository<MuscleGroup>,
    @InjectRepository(Muscle) private muscles: Repository<Muscle>,
  ) {}

  // Se ejecuta una vez al arrancar el backend
  async onModuleInit() {
    if ((await this.groups.count()) > 0) return;
    for (const [groupName, muscleNames] of Object.entries(SEED)) {
      const group = await this.groups.save(this.groups.create({ name: groupName }));
      await this.muscles.save(
        muscleNames.map((name) => this.muscles.create({ name, groupId: group.id })),
      );
    }
    console.log('[CATALOG] Grupos musculares y músculos cargados');
  }

  findGroups() {
    return this.groups.find({ order: { name: 'ASC' } });
  }

  // Solo los músculos que pertenecen al grupo elegido
  findMuscles(groupId: number) {
    return this.muscles.find({ where: { groupId }, order: { name: 'ASC' } });
  }
}