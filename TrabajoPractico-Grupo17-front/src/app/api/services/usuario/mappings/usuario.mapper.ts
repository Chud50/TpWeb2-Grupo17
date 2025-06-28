import { Usuario } from "../../../../modules/usuarios/interfaces/usuario.interface";
import { UsuarioRest } from "../interfaces/usuario.interface.rest";

/**
 * Mapper para transformar datos entre el backend (REST) y el frontend
 * Siguiendo el patrón del profesor
 */
export class UsuarioMapper {
  
  /**
   * Convierte un UsuarioRest del backend a Usuario del frontend
   */
  static mapRestUsuarioToUsuario(usuarioRest: UsuarioRest): Usuario {
    return {
      id: usuarioRest.id,
      nombre: usuarioRest.nombre,
      apellido: usuarioRest.apellido,
      email: usuarioRest.email,
      direccion: usuarioRest.direccion
    };
  }

  /**
   * Convierte un array de UsuarioRest a array de Usuario
   */
  static mapRestUsuarioRestArrayToUsuarioArray(usuariosRest: UsuarioRest[]): Usuario[] {
    return usuariosRest.map(this.mapRestUsuarioToUsuario);
  }
}
