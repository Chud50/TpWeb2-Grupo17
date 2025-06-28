import { Request } from "express";
import { Response } from "express";
import { UsuarioRepository } from "../repository/usuario.repository";
import { UsuarioService } from "../services/usuario.service";

const usuarioRepository = new UsuarioRepository()
const usuarioService = new UsuarioService(usuarioRepository);

export class UsuarioController {

    constructor() { }

    public getUsuarios = async (_req: Request, res: Response) => {
        try {
            const usuarios = await usuarioService.getListUsuarios(); //se puede cambiar por prisma pero no se si hace falta
            res.status(200).json(usuarios)
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al obtener los usuarios', error })
        }
    }

    public getUsuario = async (req: Request, res: Response) => {
        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID inválido' })
            }

            const usuario = await usuarioService.obtenerUsuarioPorId(id);

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' })
            }

            res.status(200).json(usuario)
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al obtener el usuario', error })
        }
    }

    public createUsuario = async (req: Request, res: Response) => {
        try {
            console.log('📝 DEBUG: Datos recibidos en backend:', req.body);
            const usuario = await usuarioService.crearUsuario(req.body)
            console.log('✅ DEBUG: Usuario creado:', usuario);
            return res.status(201).json(usuario);  // Agregamos return explícito
        } catch (error: any) {
            console.log('❌ ERROR en createUsuario:', error);
            
            // Verificar que no hayamos enviado ya una respuesta
            if (res.headersSent) {
                console.log('⚠️ Headers ya enviados, no se puede responder');
                return;
            }
            
            // Manejo específico para errores de Prisma
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                return res.status(409).json({ 
                    message: 'El email ya está registrado',
                    code: 'EMAIL_ALREADY_EXISTS'
                });
            }
            
            return res.status(400).json({ message: 'Error al crear el usuario', error });
        }
    }

    public updateUsuario = async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        const { nombre, apellido, direccion, password, email } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' })
        }

        try {
            const actualizado = await usuarioService.actualizarUsuario(id, { nombre, apellido, direccion, password, email })
            res.status(200).json(actualizado)
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'Error al actualizar el usuario', error })
        }
    }

    public deleteUsuario = async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' })
        }

        console.log(id);
        
        try {
            await usuarioService.eliminarUsuario(id);
            res.status(204).send();
        } catch (error) {
            if(error.message == 'UsuarioNoExiste'){
                return res.status(404).json({message: 'Usuario no encontrado'})
            }
            console.log(error);
            res.status(400).json({ message: 'Error al eliminar el usuario', error })
        }

    }



}