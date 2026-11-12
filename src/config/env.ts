// Gestiona la configuración de la aplicación y las variables de entorno.
// Este archivo centraliza la carga, validación y exportación de todas las variables de entorno, garantizando consistencia y proporcionando valores por defecto cuando es necesario.

export const {
  PORT = 3000,
  LOG_LEVEL = 'info',
  SECRET_KEY,
  DATABASE_URL,
  CLIENT_URL,
  NODE_ENV = 'development',
} = process.env;