import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CarritoService } from '../api/services/carrito/carrito.service';
import { AuthService } from '../api/services/auth/auth.service';
import { Carrito, CarritoItem } from '../modules/carrito/interfaces/carrito.interface';
import { NavbarComponent } from '../shared/navbar/navbar';
import { FooterComponent } from '../shared/footer/footer';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class CarritoComponent implements OnInit, OnDestroy {
  carrito: Carrito | null = null;
  private subscription: Subscription = new Subscription();

  toastMensaje = '';
  mostrarToast = false;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
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

  aumentarCantidad(item: CarritoItem): void {
    this.carritoService.agregarProducto(item.producto, 1);
  }

  disminuirCantidad(item: CarritoItem): void {
    this.carritoService.quitarProducto(item.producto.id!, 1);
  }

  eliminarProducto(item: CarritoItem): void {
    this.carritoService.eliminarProducto(item.producto.id!);
    this.mostrarNotificacion(`${item.producto.nombre} eliminado del carrito`);
  }

  limpiarCarrito(): void {
    this.carritoService.limpiarCarrito();
    this.mostrarNotificacion('Carrito limpiado exitosamente');
  }

  get carritoVacio(): boolean {
    return !this.carrito || this.carrito.items.length === 0;
  }

  trackByItem(index: number, item: CarritoItem): number {
    return item.producto.id || index;
  }

  logout() {
      this.carritoService.limpiarCarrito(); // Limpiar el carrito al cerrar sesión
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  mostrarNotificacion(mensaje: string) {
    this.toastMensaje = mensaje;
    this.mostrarToast = true;
    setTimeout(() => {
      this.mostrarToast = false;
    }, 3000);
  }

  navegarAProductos(): void {
    console.log('🔗 Navegando a productos desde carrito, preservando filtros');
    this.router.navigate(['/productos'], { 
      queryParamsHandling: 'preserve' 
    });
  }
}
