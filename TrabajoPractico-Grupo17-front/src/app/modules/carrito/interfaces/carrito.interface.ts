import { Producto } from '../../productos/interfaces/producto.interface';

/**
 * Interface del módulo Carrito (siguiendo patrón del profesor)
 * Representa un item individual en el carrito
 */
export interface CarritoItem {
  id: string;           // ID único del item en carrito
  producto: Producto;   // Producto completo
  cantidad: number;     // Cantidad de este producto
  subtotal: number;     // precio * cantidad (calculado)
}

/**
 * Interface para el estado completo del carrito
 */
export interface Carrito {
  id: string;           // ID único del carrito
  items: CarritoItem[]; // Lista de items
  total: number;        // Total general (calculado)
  cantidadTotal: number; // Cantidad total de productos
  fechaCreacion: Date;  // Cuando se creó
  fechaActualizacion: Date; // Última modificación
}

/**
 * Interface para operaciones del carrito
 */
export interface CarritoOperacion {
  tipo: 'agregar' | 'quitar' | 'eliminar' | 'limpiar';
  productoId?: number;
  cantidad?: number;
}
