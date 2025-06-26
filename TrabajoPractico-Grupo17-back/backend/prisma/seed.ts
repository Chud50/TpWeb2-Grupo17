// @ts-ignore
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creando productos iniciales...');
  
  const productos = [
    {
      nombre: 'Remera básica',
      imagen: 'assets/remera.jpg',
      categoria: 'Remeras',
      precio: 3500
    },
    {
      nombre: 'Jean clásico',
      imagen: 'assets/jean.jpg',
      categoria: 'Pantalones',
      precio: 8500
    },
    {
      nombre: 'Buzo argentina',
      imagen: 'assets/buzo.jpg',
      categoria: 'Buzos',
      precio: 6500
    }
  ];

  for (const producto of productos) {
    const result = await prisma.producto.create({
      data: producto
    });
    console.log(`Producto creado: ${result.nombre}`);
  }

  console.log('¡Productos creados exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
