/**
 * Interface del módulo Producto (siguiendo patrón del profesor)
 * Esta es la representación que usa la aplicación Angular
 */
export interface Producto {
  id?: number;
  nombre: string;
  imagen: string;
  categoria: string;
  precio: number;
  // Campos adicionales que puede necesitar el frontend
  precioFormateado?: string;  // Para mostrar precio con formato
  disponible?: boolean;       // Para manejar disponibilidad
}

/**
 * Interface para filtros de productos
 */
export interface ProductoFiltro {
  categoria?: string;
  precioMin?: number;
  precioMax?: number;
  nombre?: string;
}

/**
 * Interface para datos de creación/edición de productos
 */
export interface ProductoForm {
  nombre: string;
  imagen: string;
  categoria: string;
  precio: number;
}
