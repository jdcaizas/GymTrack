import { IsInt, IsNumber, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class ExerciseDto {
  @IsString()
  @MinLength(2, { message: 'El nombre es muy corto' })
  name: string;

  @IsInt({ message: 'Selecciona un músculo' })
  @Min(1, { message: 'Selecciona un músculo' })
  muscleId: number;

  @IsNumber()
  @Min(1)
  @Max(50)
  sets: number;

  @IsNumber()
  @Min(1)
  @Max(200)
  reps: number;

  @IsNumber()
  @Min(0)
  @Max(1000)
  weightKg: number;

  @IsOptional()
  @IsString()
  notes?: string;
}