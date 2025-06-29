import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductoService } from '../api/services/producto/producto.service';
import { CarritoService } from '../api/services/carrito/carrito.service';
import { AuthService } from '../api/services/auth/auth.service';
import { Producto } from '../modules/productos/interfaces/producto.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  productosOriginal: Producto[] = [];
  loading = true;
  error = '';
  cantidadEnCarrito = 0;

  filtros = {
  categoria: '',
  precioMin: null as number | null,
  precioMax: null as number | null,
  nombre: '',
  descripcion: ''
};


  categorias: string[] = ['Ropa', 'Electrónica', 'Libros'];

  ordenSeleccionado = '';

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

  cargarProductos() {
    this.loading = true;
    this.error = '';
    this.productoService.listProductos().subscribe({
      next: (productos) => {
        this.productosOriginal = productos;
        this.productos = productos;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar productos del servidor';
        this.loading = false;
      }
    });
  }

 aplicarFiltros() {
  console.log('Aplicando filtros:', this.filtros);
  this.productos = this.productosOriginal.filter(prod => {
    const matchCategoria = this.filtros.categoria ? prod.clasificacion === this.filtros.categoria : true;
    const matchPrecioMin = this.filtros.precioMin != null ? prod.precio >= this.filtros.precioMin : true;
    const matchPrecioMax = this.filtros.precioMax != null ? prod.precio <= this.filtros.precioMax : true;
    const matchNombre = this.filtros.nombre ? prod.nombre.toLowerCase().includes(this.filtros.nombre.toLowerCase()) : true;
    const matchDescripcion = this.filtros.descripcion ? prod.descripcion.toLowerCase().includes(this.filtros.descripcion.toLowerCase()) : true;

    return matchCategoria && matchPrecioMin && matchPrecioMax && matchNombre && matchDescripcion;
  });
  console.log('Productos filtrados:', this.productos);
}

limpiarFiltros() {
  this.filtros = {
    categoria: '',
    precioMin: null,
    precioMax: null,
    nombre: '',
    descripcion: ''
  };
  this.productos = [...this.productosOriginal];
}

  aplicarOrden() {
    console.log('Aplicando orden:', this.ordenSeleccionado);
    if (!this.ordenSeleccionado) return;

    const orden = this.ordenSeleccionado;

    this.productos.sort((a, b) => {
      switch (orden) {
        case 'precioAsc':
          return a.precio - b.precio;
        case 'precioDesc':
          return b.precio - a.precio;
        case 'nombreAsc':
          return a.nombre.localeCompare(b.nombre);
        case 'nombreDesc':
          return b.nombre.localeCompare(a.nombre);
        default:
          return 0;
      }
    });
    console.log('Productos ordenados:', this.productos);
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
