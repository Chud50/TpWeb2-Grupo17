/**
 * Interface que representa la estructura de datos del producto
 * tal como viene del backend REST API (siguiendo patrón del profesor)
 */
export interface ProductoRest {
  id?: number;
  nombre: string;
  imagen: string;
  categoria: string;
  precio: number;
}
