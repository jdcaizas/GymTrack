import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MuscleGroup } from './muscle-group.entity.js';

@Entity('muscles')
export class Muscle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // FK: cada músculo pertenece a un grupo muscular
  @Column()
  groupId: number;

  @ManyToOne(() => MuscleGroup, { eager: true })
  @JoinColumn({ name: 'groupId' })
  group: MuscleGroup;
}