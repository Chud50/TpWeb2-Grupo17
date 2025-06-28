import { Request } from "express";
import { Response } from "express";
import { ProductoRepository } from "../repository/producto.repository";
import { ProductoService } from "../services/producto.service";

const productoRepository = new ProductoRepository();
const productoService = new ProductoService(productoRepository);

export class ProductoController {

    constructor() { }

    public getProductos = async (_req: Request, res: Response) => {
        try {
            const productos = await productoService.getListProductos();
            res.status(200).json(productos);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al obtener los productos', error });
        }
    }

    public getProducto = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID inválido' });
            }

            const producto = await productoService.obtenerProductoPorId(id);

            if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            res.status(200).json(producto);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al obtener el producto', error });
        }
    }
    public createProducto = async (req: Request, res: Response) => {
        try {
            console.log('📝 DEBUG: Datos recibidos en backend (producto):', req.body);
            const producto = await productoService.crearProducto(req.body);
            console.log('✅ DEBUG: Producto creado:', producto);
            return res.status(201).json(producto);  // Agregamos return explícito y status 201
        } catch (error: any) {
            console.log('❌ ERROR en createProducto:', error);
            
            // Verificar que no hayamos enviado ya una respuesta
            if (res.headersSent) {
                console.log('⚠️ Headers ya enviados, no se puede responder');
                return;
            }
            
            // Manejo específico para errores de Prisma
            if (error.code === 'P2002') {
                return res.status(409).json({ 
                    message: 'Ya existe un producto con estos datos',
                    code: 'DUPLICATE_PRODUCT'
                });
            }
            
            return res.status(400).json({ message: 'Error al crear el producto', error });
        }
    }

    public updateProducto = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const { nombre, descripcion, clasificacion, precio, imagen } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        try {
            const actualizado = await productoService.actualizarProducto(id, { nombre, descripcion, clasificacion, precio, imagen });
            res.status(200).json(actualizado);
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'Error al actualizar el producto', error });
        }
    }
    public deleteProducto = async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        try {
            await productoService.eliminarProducto(id);
            res.status(204).send();
        } catch (error) {
            if( error.message == 'ProductoNoExiste' ) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            console.log(error);
            res.status(400).json({ message: 'Error al eliminar el producto', error });
        }
    }
}