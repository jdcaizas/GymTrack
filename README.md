# GymTrack

Aplicación web para quienes entrenan en el gimnasio: permite organizar ejercicios, registrar series, repeticiones y peso, y consultar todo desde cualquier dispositivo.

Proyecto de la asignatura de Ingeniería Web — Universidad de las Américas.

**Demo en línea:** https://gym-track-lake.vercel.app


**Video explicativo:** https://youtu.be/a__GtCJsEtc

## Tecnologías

- **Back-end:** NestJS (TypeScript), TypeORM
- **Front-end:** Vue 3 (Vite)
- **Base de datos:** SQLite en desarrollo / [PostgreSQL en producción]
- **Autenticación:** JWT + bcrypt

## Funcionalidades de la administración

- Registro e inicio de sesión con contraseña encriptada (bcrypt).
- Rutas protegidas: solo usuarios con sesión iniciada acceden al CRUD.
- CRUD de ejercicios, donde cada usuario ve y edita únicamente lo suyo.
- **Validación de dato sensible en back-end:** la cédula ecuatoriana se valida en el servidor (provincia, tipo de persona y dígito verificador módulo 10) antes de guardarse, y no se permiten cédulas repetidas.
- **Dropdowns dependientes con claves foráneas:** Grupo muscular → Músculo → Ejercicio. El servidor verifica que el músculo exista antes de guardar.

## Modelo de datos

- `users` (id, email, name, cedula, passwordHash)
- `muscle_groups` (id, name)
- `muscles` (id, name, groupId → muscle_groups)
- `exercises` (id, name, muscleId → muscles, sets, reps, weightKg, notes, userId)

## Instalación y ejecución

### Requisitos
- Node.js 20 o superior
- npm

### Back-end
```bash
cd backend
npm install
npm run start:dev
```
Corre en `http://localhost:3000`. La base de datos `gymtrack.db` y los datos iniciales (grupos y músculos) se crean automáticamente al arrancar.

### Front-end
```bash
cd frontend
npm install
npm run dev
```

## Autor

Juan David Caiza — Ingeniería de Software, Universidad de las Américas
