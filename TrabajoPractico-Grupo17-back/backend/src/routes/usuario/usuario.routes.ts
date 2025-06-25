import { Router } from "express";
import { UsuarioController } from "../../controller/usuario.controller";

export const usuarioRouter = Router();

const usuarioController = new UsuarioController();

usuarioRouter.get('/', usuarioController.getUsuarios.bind(usuarioController))
usuarioRouter.get('/:id', usuarioController.getUsuario.bind(usuarioController))
usuarioRouter.post('/', usuarioController.createUsuario.bind(usuarioController))
usuarioRouter.put('/:id', usuarioController.updateUsuario.bind(usuarioController))
usuarioRouter.delete('/:id', usuarioController.deleteUsuario.bind(usuarioController))