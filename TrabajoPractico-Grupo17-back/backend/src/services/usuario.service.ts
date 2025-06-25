import { UsuarioRepository } from "../repository/usuario.repository";

export class UsuarioService {


    constructor(private usuarioRepository: UsuarioRepository) {
    }

    async getListUsuarios() {
        return await this.usuarioRepository.getUsuarios();
    }

    async obtenerUsuarioPorId(id: number) {
        return await this.usuarioRepository.getUsuarioById(id);
    }

    async crearUsuario(data: { [key: string]: any }) {

        const { nombre, apellido, direccion, password, email } = data;

        if (!nombre || typeof nombre !== 'string') {
            throw new Error('El nombre es obligatorio y debe ser un string')
        }

        if (apellido !== undefined && typeof apellido !== 'string') {
            throw new Error('El apellido debe ser un string')
        }

        if (direccion !== undefined && typeof direccion !== 'string') {
            throw new Error('La dirección debe ser un string')
        }

        if (password !== undefined && typeof password !== 'string') {
            throw new Error('La contraseña debe ser un string')
        }

        if (email !== undefined && typeof email !== 'string') {
            throw new Error('El email debe ser un string')
        }

        return await this.usuarioRepository.create(
            {
                nombre,
                apellido,
                direccion,
                password,
                email,
                //id_producto: id_producto !== undefined ? Number(id_producto) : undefined
            }
        );
    }

    async actualizarUsuario(id: number, data: { nombre?: string, apellido?: string, direccion?: string, password?: string, email?: string }) {
        return this.usuarioRepository.update(id, data)
    }

    async eliminarUsuario(id: number) {
        try {
            return await this.usuarioRepository.delete(id)
        } catch (error) {
            if (error.code == 'P2025') {
                throw new Error('UsuarioNoExiste')
            }
            throw error
        }
    }



}