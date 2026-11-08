import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  // Cédula validada en back-end antes de guardarse; única por usuario
  @Column({ unique: true, length: 10 })
  cedula: string;

  // Aquí se guarda el HASH de bcrypt, nunca la contraseña real
  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;
}