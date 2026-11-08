import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2, { message: 'El nombre es muy corto' })
  name: string;

  @IsEmail({}, { message: 'Correo inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  @Length(10, 10, { message: 'La cédula debe tener 10 dígitos' })
  cedula: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Correo inválido' })
  email: string;

  @IsString()
  password: string;
}