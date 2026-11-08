import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuscleGroup } from './muscle-group.entity.js';
import { Muscle } from './muscle.entity.js';
import { CatalogService } from './catalog.service.js';
import { CatalogController } from './catalog.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([MuscleGroup, Muscle])],
  providers: [CatalogService],
  controllers: [CatalogController],
})
export class CatalogModule {}