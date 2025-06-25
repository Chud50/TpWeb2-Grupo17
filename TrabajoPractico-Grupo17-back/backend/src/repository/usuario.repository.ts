import { prisma } from "../prisma";

export class UsuarioRepository {

    async getUsuarios() {
    return await prisma.usuario.findMany();
}

    async getUsuarioById(id: number) {
    return await prisma.usuario.findUnique({
        where: { id }
        //relacion con lista productos adquiridos
    });
}

    async create(data: { nombre: string; apellido: string; direccion: string; password: string; email: string }) {
    return await prisma.usuario.create({
        data: {
            nombre: data.nombre,
            apellido: data.apellido,
            direccion: data.direccion,
            password: data.password,
            email: data.email
        }
    });
}

    async update(id: number, data: {nombre?: string; apellido?: string; direccion?: string; password?: string; email?: string;}) {
        return await prisma.usuario.update({
            where: { id },
            data
        });
    }

    async delete(id: number) {
        return await prisma.usuario.delete({
            where: {id}
        })
    }
}