import { ProductoRepository } from "../repository/producto.repository";

export class ProductoService {

    constructor(private productoRepository: ProductoRepository) {
    }

    async getListProductos() {
        return await this.productoRepository.getProductos();
    }

    async obtenerProductoPorId(id: number) {
        return await this.productoRepository.getProductoById(id);
    }

    async crearProducto(data: { nombre: string; imagen: string; categoria: string; precio: number }) {
        const { nombre, imagen, categoria, precio } = data;

        if (!nombre || typeof nombre !== 'string') {
            throw new Error('El nombre es obligatorio y debe ser un string');
        }

        if (imagen !== undefined && typeof imagen !== 'string') {
            throw new Error('La imagen debe ser un string');
        }

        if (categoria !== undefined && typeof categoria !== 'string') {
            throw new Error('La categoría debe ser un string');
        }

        if (precio !== undefined && typeof precio !== 'number') {
            throw new Error('El precio debe ser un número');
        }

        return await this.productoRepository.create({ nombre, imagen, categoria, precio });
    }

    async actualizarProducto(id: number, data: { nombre?: string; imagen?: string; categoria?: string; precio?: number }) {
        return this.productoRepository.update(id, data);
    }

    async eliminarProducto(id: number) {
        try {
            return await this.productoRepository.delete(id);
        } catch (error) {
            throw new Error(`Error al eliminar el producto con id ${id}: ${error.message}`);
        }
    }
}