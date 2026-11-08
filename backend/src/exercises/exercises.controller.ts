import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ExercisesService } from './exercises.service.js';
import { ExerciseDto } from './exercise.dto.js';

type AuthRequest = { user: { userId: number; email: string } };

// El guard a nivel de clase protege TODAS las rutas del CRUD
@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(private service: ExercisesService) {}

  @Get()
  findAll(@Request() req: AuthRequest) {
    return this.service.findAll(req.user.userId);
  }

  @Post()
  create(@Request() req: AuthRequest, @Body() dto: ExerciseDto) {
    return this.service.create(req.user.userId, dto);
  }

  @Put(':id')
  update(
    @Request() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ExerciseDto,
  ) {
    return this.service.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.service.remove(req.user.userId, id);
  }
}