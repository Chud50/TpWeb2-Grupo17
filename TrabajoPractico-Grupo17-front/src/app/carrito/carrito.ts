import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CarritoService } from '../api/services/carrito/carrito.service';
import { Carrito, CarritoItem } from '../modules/carrito/interfaces/carrito.interface';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class CarritoComponent implements OnInit, OnDestroy {
  carrito: Carrito | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    // Suscribirse al estado reactivo del carrito
    this.subscription.add(
      this.carritoService.getCarrito().subscribe(carrito => {
        this.carrito = carrito;
        console.log('🛒 Carrito actualizado:', carrito);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Aumentar cantidad de un producto
   */
  aumentarCantidad(item: CarritoItem): void {
    this.carritoService.agregarProducto(item.producto, 1);
  }

  /**
   * Disminuir cantidad de un producto
   */
  disminuirCantidad(item: CarritoItem): void {
    this.carritoService.quitarProducto(item.producto.id!, 1);
  }

  /**
   * Eliminar producto completamente del carrito
   */
  eliminarProducto(item: CarritoItem): void {
    if (confirm(`¿Eliminar ${item.producto.nombre} del carrito?`)) {
      this.carritoService.eliminarProducto(item.producto.id!);
    }
  }

  /**
   * Limpiar todo el carrito
   */
  limpiarCarrito(): void {
    if (confirm('¿Limpiar todo el carrito?')) {
      this.carritoService.limpiarCarrito();
    }
  }

  /**
   * Getter para verificar si el carrito está vacío
   */
  get carritoVacio(): boolean {
    return !this.carrito || this.carrito.items.length === 0;
  }

  /**
   * Método trackBy para mejorar el rendimiento del ngFor en el carrito
   */
  trackByItem(index: number, item: CarritoItem): number {
    return item.producto.id || index;
  }
}
