import { Injectable } from '@angular/core';
import { Producto } from '../modules/productos/interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: Producto[] = [];

  getCarrito(): Producto[] {
    return this.carrito;
  }

  agregarProducto(producto: Producto): void {
    this.carrito.push(producto);
  }

  limpiarCarrito(): void {
    this.carrito = [];
  }

  eliminarProducto(index: number): void {
    this.carrito.splice(index, 1);
  }

  getTotal(): number {
    return this.carrito.reduce((total, producto) => total + producto.precio, 0);
  }

  getCantidadProductos(): number {
    return this.carrito.length;
  }
}