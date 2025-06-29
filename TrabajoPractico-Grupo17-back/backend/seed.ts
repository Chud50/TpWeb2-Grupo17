import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.producto.createMany({
    data: [
      {
        nombre: "Camiseta",
        descripcion: "Camiseta deportiva de algodón",
        clasificacion: "Ropa",
        precio: 1200,
        imagen: "camiseta.jpg"
      },
      {
        nombre: "Auriculares",
        descripcion: "Auriculares inalámbricos Bluetooth",
        clasificacion: "Electrónica",
        precio: 3500,
        imagen: "auriculares.jpg"
      },
      {
        nombre: "Libro",
        descripcion: "Libro de programación para principiantes",
        clasificacion: "Libros",
        precio: 800,
        imagen: "libro.jpg"
      }
    ],
  });

  console.log("Productos cargados correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
