/**
 * Interface que representa la estructura de datos del producto
 * tal como viene del backend REST API (siguiendo patrón del profesor)
 */
export interface ProductoRest {
  id?: number;
  nombre: string;
  descripcion: string;
  clasificacion: string;
  precio: number;
  imagen: string;
}
