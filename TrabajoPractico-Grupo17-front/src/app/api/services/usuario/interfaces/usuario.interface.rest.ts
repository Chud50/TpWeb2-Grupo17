/**
 * Interface que representa la estructura de datos del usuario
 * tal como viene del backend REST API (siguiendo patrón del profesor)
 */
export interface UsuarioRest {
  id?: number;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  direccion: string;
}
