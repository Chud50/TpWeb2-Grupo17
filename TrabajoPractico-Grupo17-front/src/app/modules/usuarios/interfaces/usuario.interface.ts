/**
 * Interface del módulo Usuario (siguiendo patrón del profesor)
 * Esta es la representación que usa la aplicación Angular
 */
export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  direccion: string;
}
