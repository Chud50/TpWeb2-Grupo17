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
            const producto = await productoService.crearProducto(req.body);
            res.status(200).json(producto);
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'Error al crear el producto', error });
        }
    }

    public updateProducto = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const { nombre, precio, imagen, categoria } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        try {
            const actualizado = await productoService.actualizarProducto(id, { nombre, imagen, categoria, precio });
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