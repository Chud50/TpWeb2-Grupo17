// @ts-ignore
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creando productos iniciales con nuevo schema...');
  
  const productos = [
    {
      nombre: 'Remera básica',
      descripcion: 'Remera de algodón 100%, cómoda y versátil para uso diario',
      clasificacion: 'Remeras',
      precio: 3500,
      imagen: 'assets/remera.jpg'
    },
    {
      nombre: 'Jean clásico',
      descripcion: 'Jean de corte clásico, tela de alta calidad y resistente',
      clasificacion: 'Pantalones',
      precio: 8500,
      imagen: 'assets/jean.jpg'
    },
    {
      nombre: 'Buzo argentina',
      descripcion: 'Buzo con capucha diseño Argentina, ideal para días fríos',
      clasificacion: 'Buzos',
      precio: 6500,
      imagen: 'assets/buzo.jpg'
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
