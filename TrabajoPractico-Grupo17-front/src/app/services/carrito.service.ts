import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: any[] = [];

  getCarrito() {
    return this.carrito;
  }

  agregarProducto(producto: any) {
    this.carrito.push(producto);
  }

  limpiarCarrito() {
    this.carrito = [];
  }
}