// En producción el secreto viene de una variable de entorno (nunca se sube a GitHub).
// El valor de respaldo solo sirve para desarrollo local.
export const JWT_SECRET = process.env.JWT_SECRET || 'secreto-solo-para-desarrollo';