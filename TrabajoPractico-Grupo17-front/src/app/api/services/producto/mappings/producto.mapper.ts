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
      imagen: productoRest.imagen,
      categoria: productoRest.categoria,
      precio: productoRest.precio,
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
      imagen: producto.imagen,
      categoria: producto.categoria,
      precio: producto.precio
      // No incluimos los campos calculados del frontend
    };
  }
}
