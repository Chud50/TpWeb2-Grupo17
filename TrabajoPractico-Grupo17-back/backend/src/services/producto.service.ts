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

    async crearProducto(data: { nombre: string; descripcion: string; clasificacion: string; precio: number }) {
        const { nombre, descripcion, clasificacion, precio } = data;

        if (!nombre || typeof nombre !== 'string') {
            throw new Error('El nombre es obligatorio y debe ser un string');
        }

        if (descripcion !== undefined && typeof descripcion !== 'string') {
            throw new Error('La descripción debe ser un string');
        }

        if (clasificacion !== undefined && typeof clasificacion !== 'string') {
            throw new Error('La clasificación debe ser un string');
        }

        if (precio !== undefined && typeof precio !== 'number') {
            throw new Error('El precio debe ser un número');
        }

        return await this.productoRepository.create({ nombre, descripcion, clasificacion, precio });
    }

    async actualizarProducto(id: number, data: { nombre?: string; descripcion?: string; clasificacion?: string; precio?: number }) {
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