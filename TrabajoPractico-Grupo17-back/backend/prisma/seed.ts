// @ts-ignore
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Reseteando productos...');
  await prisma.producto.deleteMany();

  console.log('📦 Cargando productos iniciales...');

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
      nombre: 'Buzo Argentina',
      descripcion: 'Buzo con capucha diseño Argentina, ideal para días fríos',
      clasificacion: 'Buzos',
      precio: 6500,
      imagen: 'assets/buzo.jpg'
    },
    {
      nombre: 'Remera Argentina',
      descripcion: 'Remera Adidas original selección Argentina',
      clasificacion: 'Remeras',
      precio: 9500,
      imagen: 'assets/argentina.jpg'
    },
    {
      nombre: 'Remera Messi',
      descripcion: 'Remera edición limitada de Lionel Messi',
      clasificacion: 'Remeras',
      precio: 10500,
      imagen: 'assets/remeramessi.jpg'
    },
    {
      nombre: 'Remera Real Madrid',
      descripcion: 'Remera oficial del Real Madrid CF',
      clasificacion: 'Remeras',
      precio: 9800,
      imagen: 'assets/remeramadrid.jpg'
    },
    {
      nombre: 'Remera Lacoste',
      descripcion: 'Remera premium marca Lacoste con logo bordado',
      clasificacion: 'Remeras',
      precio: 11500,
      imagen: 'assets/remeralacoste.jpg'
    },
    {
      nombre: 'Remera Azul',
      descripcion: 'Remera azul clásica, ideal para uso diario',
      clasificacion: 'Remeras',
      precio: 4200,
      imagen: 'assets/remeraazul.jpg'
    },
    {
      nombre: 'Remera Puma',
      descripcion: 'Remera deportiva marca Puma de alta calidad',
      clasificacion: 'Remeras',
      precio: 8700,
      imagen: 'assets/remerapuma.jpg'
    },
    {
      nombre: 'Remera River',
      descripcion: 'Remera oficial de River Plate con diseño exclusivo',
      clasificacion: 'Remeras',
      precio: 9700,
      imagen: 'assets/remerariver.jpg'
    },
    {
      nombre: 'Remera Topper',
      descripcion: 'Remera deportiva marca Topper, cómoda y resistente',
      clasificacion: 'Remeras',
      precio: 8800,
      imagen: 'assets/remeratopper.jpg'
    },
    // Pantalones nuevos
    {
      nombre: 'Pantalón Beige',
      descripcion: 'Pantalón beige cómodo y versátil',
      clasificacion: 'Pantalones',
      precio: 7200,
      imagen: 'assets/pantalonbeige.jpg'
    },
    {
      nombre: 'Pantalón Oversize',
      descripcion: 'Pantalón oversize para un estilo relajado',
      clasificacion: 'Pantalones',
      precio: 7500,
      imagen: 'assets/pantalonoversize.jpg'
    },
    {
      nombre: 'Pantalón Cargo',
      descripcion: 'Pantalón cargo con múltiples bolsillos',
      clasificacion: 'Pantalones',
      precio: 8200,
      imagen: 'assets/pantaloncargo.jpg'
    },
    {
      nombre: 'Pantalón Militar',
      descripcion: 'Pantalón estilo militar, resistente y moderno',
      clasificacion: 'Pantalones',
      precio: 9000,
      imagen: 'assets/pantalonmilitar.jpg'
    },
    {
      nombre: 'Pantalón Verde Oscuro',
      descripcion: 'Pantalón verde oscuro ideal para todo ocasión',
      clasificacion: 'Pantalones',
      precio: 7700,
      imagen: 'assets/pantalonverdeoscuro.jpg'
    },
    {
      nombre: 'Pantalón Cargo Negro',
      descripcion: 'Pantalón cargo negro, versátil y cómodo',
      clasificacion: 'Pantalones',
      precio: 8300,
      imagen: 'assets/pantaloncargonegro.jpg'
    },
    {
      nombre: 'Pantalón Lacoste Cargo Beige',
      descripcion: 'Pantalón cargo beige de marca Lacoste',
      clasificacion: 'Pantalones',
      precio: 11500,
      imagen: 'assets/pantalonlacostecargobeige.jpg'
    },
    {
      nombre: 'Buzo Medio Cierre Lacoste Negro',
      descripcion: 'Buzo con medio cierre y capucha, marca Lacoste, color negro',
      clasificacion: 'Buzos',
      precio: 14500,
      imagen: 'assets/buzomediocierre-con-capucha-lacoste-negro.jpg'
    },
    {
      nombre: 'Buzo Lacoste Verde',
      descripcion: 'Buzo con capucha Lacoste en tono verde',
      clasificacion: 'Buzos',
      precio: 14200,
      imagen: 'assets/buzo-lacoste-verde.jpg'
    },
    {
      nombre: 'Buzo Lacoste Terracota',
      descripcion: 'Buzo con capucha Lacoste color terracota',
      clasificacion: 'Buzos',
      precio: 14000,
      imagen: 'assets/buzo-lacoste-terracota.jpg'
    },
    {
      nombre: 'Buzo Lacoste Mujer Gris',
      descripcion: 'Buzo con capucha para mujer, Lacoste color gris',
      clasificacion: 'Buzos',
      precio: 14800,
      imagen: 'assets/buzo-lacoste-mujer-gris.jpg'
    },
    {
      nombre: 'Buzo Lacoste Azul',
      descripcion: 'Buzo con capucha Lacoste color azul',
      clasificacion: 'Buzos',
      precio: 14400,
      imagen: 'assets/buzo-con-capucha-lacoste-azul.jpg'
    },
    {
      nombre: 'Buzo Puma Scuderia Ferrari Rojo',
      descripcion: 'Buzo con capucha Puma edición Scuderia Ferrari, rojo',
      clasificacion: 'Buzos',
      precio: 15000,
      imagen: 'assets/buzo-con-capucha-puma-scuderia-ferrari-rojo.jpg'
    },
    {
      nombre: 'Buzo Lacoste Mujer Crudo',
      descripcion: 'Buzo con capucha para mujer, Lacoste color crudo',
      clasificacion: 'Buzos',
      precio: 14800,
      imagen: 'assets/buzo-lacoste-mujer-crudo.jpg'
    },
    {
      nombre: 'Buzo Lacoste Verde Estampa',
      descripcion: 'Buzo con capucha Lacoste verde con estampa',
      clasificacion: 'Buzos',
      precio: 14600,
      imagen: 'assets/buzo-lacoste-verdeestampa.jpg'
    },
    {
      nombre: 'Buzo Puma Porsche Verde',
      descripcion: 'Buzo Puma Porsche Legacy Lifestyle verde',
      clasificacion: 'Buzos',
      precio: 15200,
      imagen: 'assets/buzo-puma-porsche-legacy-lifestyle-verde.jpg'
    },
    {
      nombre: 'Buzo Real Madrid Adidas Blanco',
      descripcion: 'Buzo de Real Madrid Adidas DNA blanco',
      clasificacion: 'Buzos',
      precio: 15500,
      imagen: 'assets/buzo-de-real-madrid-adidas-dna-blanco.jpg'
    },
    {
      nombre: 'Buzo Reebok Classic Anuel AA Negro',
      descripcion: 'Buzo con capucha Reebok Classic edición Anuel AA, negro',
      clasificacion: 'Buzos',
      precio: 14900,
      imagen: 'assets/buzo-con-capucha-reebok-classic-anuel-aa-negro-.jpg'
    },
    {
      nombre: 'Buzo Adidas Terracota',
      descripcion: 'Buzo con capucha Adidas Outl Tref color terracota',
      clasificacion: 'Buzos',
      precio: 14800,
      imagen: 'assets/buzo-con-capucha-adidas-outl-tref-terracota.jpg'
    },
    {
      nombre: 'Buzo Puma BMW Motorsport Negro',
      descripcion: 'Buzo con capucha Puma BMW Motorsport Statement negro',
      clasificacion: 'Buzos',
      precio: 15300,
      imagen: 'assets/buzo-con-capucha-puma-bmw-motorsport-statement-negro.jpg'
    }
  ];

  for (const producto of productos) {
    const result = await prisma.producto.create({
      data: producto
    });
    console.log(`✅ Producto creado: ${result.nombre}`);
  }

  console.log('✨ ¡Productos creados exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error al insertar productos:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
