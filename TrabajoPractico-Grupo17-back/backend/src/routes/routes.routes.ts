import { Router } from "express";
import { usuarioRouter } from "./usuario/usuario.routes";
import { productoRouter } from "./producto/producto.routes";

export class AppRoutes {
    static get routes():Router{

        const router = Router();

        router.use('/api/usuario',usuarioRouter); 
        router.use('/api/producto',productoRouter);

        return router;
    }
    
}