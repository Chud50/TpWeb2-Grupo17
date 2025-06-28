import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../services/carrito.service';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../api/services/producto/producto.service';
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

  constructor(
    private carritoService: CarritoService,
    private productoService: ProductoService
  ) {}

  ngOnInit() {
    this.cargarProductos();
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
    this.carritoService.agregarProducto(producto);
    alert(`${producto.nombre} agregado al carrito`);
  }
}