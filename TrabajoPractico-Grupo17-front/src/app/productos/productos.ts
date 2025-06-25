import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../services/carrito.service';
import { RouterModule } from '@angular/router';

interface Producto {
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
export class ProductosComponent {
  productos: Producto[] = [
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
    // Agrega más productos aquí
  ];

  constructor(private carritoService: CarritoService) {}

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregarProducto(producto);
    alert(`${producto.nombre} agregado al carrito`);
  }
}