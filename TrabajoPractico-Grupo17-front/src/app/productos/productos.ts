import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../services/carrito.service';
import { RouterModule } from '@angular/router';

export interface Producto {
  id?: number;
  nombre: string;
  imagen: string;
  categoria: string;
  precio: number;
}

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
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  async cargarProductos() {
    this.loading = true;
    this.error = '';

    try {
      // Intentar cargar desde el backend usando fetch nativo
      const response = await fetch('http://localhost:3000/api/producto');
      
      if (response.ok) {
        const productos = await response.json();
        console.log('Productos cargados desde backend:', productos);
        console.log('Cantidad de productos:', productos.length);
        this.productos = productos;
      } else {
        throw new Error('Backend no disponible');
      }
    } catch (error) {
      console.error('Error al cargar productos desde backend:', error);
      this.error = 'Conectando con backend... Mostrando productos de ejemplo';
      
      // Fallback a datos mock
      this.productos = [
        {
          nombre: 'Remera básica',
          imagen: 'assets/remera.jpg',
          categoria: 'Remeras',
          precio: 3500
        },
        {
          nombre: 'Jean clásico',
          imagen: 'assets/jean.jpg',
          categoria: 'Pantalones',
          precio: 8500
        },
        {
          nombre: 'Buzo argentina',
          imagen: 'assets/buzo.jpg',
          categoria: 'Buzos',
          precio: 6500
        }
      ];
    } finally {
      this.loading = false;
    }
  }

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregarProducto(producto);
    alert(`${producto.nombre} agregado al carrito`);
  }
}