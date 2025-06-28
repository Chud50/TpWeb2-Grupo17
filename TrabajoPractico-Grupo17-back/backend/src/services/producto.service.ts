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

    async crearProducto(data: { nombre: string; descripcion: string; clasificacion: string; precio: number; imagen: string }) {
        const { nombre, descripcion, clasificacion, precio, imagen } = data;

        if (!nombre || typeof nombre !== 'string') {
            throw new Error('El nombre es obligatorio y debe ser un string');
        }

        if (!descripcion || typeof descripcion !== 'string') {
            throw new Error('La descripción es obligatoria y debe ser un string');
        }

        if (!clasificacion || typeof clasificacion !== 'string') {
            throw new Error('La clasificación es obligatoria y debe ser un string');
        }

        if (imagen !== undefined && typeof imagen !== 'string') {
            throw new Error('La imagen debe ser un string');
        }

        if (precio !== undefined && typeof precio !== 'number') {
            throw new Error('El precio debe ser un número');
        }

        return await this.productoRepository.create({ nombre, descripcion, clasificacion, precio, imagen });
    }

    async actualizarProducto(id: number, data: { nombre?: string; descripcion?: string; clasificacion?: string; precio?: number; imagen?: string }) {
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