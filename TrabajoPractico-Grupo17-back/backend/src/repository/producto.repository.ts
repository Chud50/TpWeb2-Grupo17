import { prisma } from "../prisma";

export class ProductoRepository {

    async getProductos() {
        return await prisma.producto.findMany();
    }

    async getProductoById(id: number) {
        return await prisma.producto.findUnique({
            where: { id }
        });
    }

    async create(data: { nombre: string; imagen: string; categoria: string; precio: number }) {
        return await prisma.producto.create({
            data
        });
    }

    async update(id: number, data: { nombre?: string; imagen?: string; categoria?: string; precio?: number }) {
        return await prisma.producto.update({
            where: { id },
            data
        });
    }

    async delete(id: number) {
        return await prisma.producto.delete({
            where: { id }
        });
    }
}