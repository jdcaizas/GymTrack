import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Muscle } from '../catalog/muscle.entity.js';

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // FK al músculo (ya no es un texto libre)
  @Column()
  muscleId: number;

  @ManyToOne(() => Muscle, { eager: true })
  @JoinColumn({ name: 'muscleId' })
  muscle: Muscle;

  @Column({ default: 3 })
  sets: number;

  @Column({ default: 10 })
  reps: number;

  @Column({ type: 'float', default: 0 })
  weightKg: number;

  @Column({ nullable: true })
  notes: string;

  // Dueño del registro: cada usuario solo ve y edita lo suyo
  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}