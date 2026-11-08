import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('muscle_groups')
export class MuscleGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}