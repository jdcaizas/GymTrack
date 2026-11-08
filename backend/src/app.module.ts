import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity.js';
import { Exercise } from './exercises/exercise.entity.js';
import { MuscleGroup } from './catalog/muscle-group.entity.js';
import { Muscle } from './catalog/muscle.entity.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ExercisesModule } from './exercises/exercises.module.js';
import { CatalogModule } from './catalog/catalog.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'gymtrack.db',
      entities: [User, Exercise, MuscleGroup, Muscle],
      synchronize: true, // solo para desarrollo: crea las tablas automáticamente
    }),
    UsersModule,
    AuthModule,
    ExercisesModule,
    CatalogModule,
  ],
})
export class AppModule {}