import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductoService } from '../api/services/producto/producto.service';
import { CarritoService } from '../api/services/carrito/carrito.service';
import { AuthService } from '../api/services/auth/auth.service';
import { Producto } from '../modules/productos/interfaces/producto.interface';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  loading = true;
  error = '';
  cantidadEnCarrito = 0;

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.actualizarCantidadCarrito();
  }

  actualizarCantidadCarrito() {
    this.carritoService.carrito$.subscribe(carrito => {
      this.cantidadEnCarrito = carrito?.cantidadTotal || 0;
    });
  }

  trackByProducto(index: number, producto: Producto): number {
    return producto.id || index;
  }

  async cargarProductos() {
    this.loading = true;
    this.error = '';

    try {
      console.log('🛍️ Cargando productos con el nuevo servicio...');
      
      // Usar el nuevo servicio con mapping
      this.productoService.listProductos().subscribe({
        next: (productos) => {
          console.log('✅ Productos cargados:', productos);
          this.productos = productos;
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Error al cargar productos:', error);
          this.error = 'Error al cargar productos del servidor';
          this.loading = false;
          
          // Los datos mock ya están manejados en el servicio
        }
      });
    } catch (error) {
      console.error('❌ Error inesperado:', error);
      this.error = 'Error inesperado al cargar productos';
      this.loading = false;
    }
  }

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregarProducto(producto, 1);
    alert(`${producto.nombre} agregado al carrito`);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}