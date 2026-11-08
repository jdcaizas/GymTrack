import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './users/user.entity.js';
import { Exercise } from './exercises/exercise.entity.js';
import { MuscleGroup } from './catalog/muscle-group.entity.js';
import { Muscle } from './catalog/muscle.entity.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ExercisesModule } from './exercises/exercises.module.js';
import { CatalogModule } from './catalog/catalog.module.js';

const entities = [User, Exercise, MuscleGroup, Muscle];

// En producción (Render) existe DATABASE_URL → PostgreSQL.
// En tu computadora no existe → SQLite como siempre.
const dbConfig: TypeOrmModuleOptions = process.env.DATABASE_URL
  ? {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      entities,
      synchronize: true,
    }
  : {
      type: 'better-sqlite3',
      database: 'gymtrack.db',
      entities,
      synchronize: true, // solo para desarrollo: crea las tablas automáticamente
    };

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    UsersModule,
    AuthModule,
    ExercisesModule,
    CatalogModule,
  ],
})
export class AppModule {}