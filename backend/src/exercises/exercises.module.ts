import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity.js';
import { ExercisesController } from './exercises.controller.js';
import { ExercisesService } from './exercises.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise])],
  controllers: [ExercisesController],
  providers: [ExercisesService],
})
export class ExercisesModule {}