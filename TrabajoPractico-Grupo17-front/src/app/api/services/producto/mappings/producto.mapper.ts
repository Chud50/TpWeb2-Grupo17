import { Producto } from "../../../../modules/productos/interfaces/producto.interface";
import { ProductoRest } from "../interfaces/producto.interface.rest";

/**
 * Mapper para transformar datos entre el backend (REST) y el frontend
 * Siguiendo el patrón del profesor
 */
export class ProductoMapper {
  
  /**
   * Convierte un ProductoRest del backend a Producto del frontend
   */
  static mapRestProductoToProducto(productoRest: ProductoRest): Producto {
    return {
      id: productoRest.id,
      nombre: productoRest.nombre,
      descripcion: productoRest.descripcion,
      clasificacion: productoRest.clasificacion,
      precio: productoRest.precio,
      imagen: productoRest.imagen,
      // Campos calculados para el frontend
      precioFormateado: `$${productoRest.precio.toFixed(2)}`,
      disponible: true // Por defecto disponible, se puede ajustar según lógica de negocio
    };
  }

  /**
   * Convierte un array de ProductoRest a array de Producto
   */
  static mapRestProductoArrayToProductoArray(productosRest: ProductoRest[]): Producto[] {
    return productosRest.map(this.mapRestProductoToProducto);
  }

  /**
   * Convierte un Producto del frontend a ProductoRest para enviar al backend
   */
  static mapProductoToRestProducto(producto: Producto): ProductoRest {
    return {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      clasificacion: producto.clasificacion,
      precio: producto.precio,
      imagen: producto.imagen
      // No incluimos los campos calculados del frontend
    };
  }
}
