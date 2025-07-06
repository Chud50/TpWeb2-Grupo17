import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ProductoService } from '../api/services/producto/producto.service';
import { CarritoService } from '../api/services/carrito/carrito.service';
import { AuthService } from '../api/services/auth/auth.service';
import { Producto } from '../modules/productos/interfaces/producto.interface';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent],
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


  categorias: string[] = ['Remeras', 'Buzos', 'Pantalones'];

  ordenSeleccionado = '';

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.actualizarCantidadCarrito();
    
    // Verificar si hay filtro de categoría en query params
    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        console.log('📂 Filtro de categoría detectado:', params['categoria']);
        console.log('📊 Productos cargados:', this.productosOriginal.length);
        console.log('🏷️ Clasificaciones en BD:', this.productosOriginal.map(p => p.clasificacion));
        
        this.filtros.categoria = params['categoria'];
        
        // Si los productos ya están cargados, aplicar filtro inmediatamente
        if (this.productosOriginal.length > 0) {
          this.aplicarFiltros();
        } else {
          // Si no, esperar a que se carguen
          setTimeout(() => {
            this.aplicarFiltros();
          }, 500);
        }
      }
    });
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
        
        console.log('📦 Productos cargados desde BD:', productos.length);
        console.log('🏷️ Clasificaciones disponibles:', [...new Set(productos.map(p => p.clasificacion))]);
        
        // Aplicar filtro si hay uno pendiente
        if (this.filtros.categoria) {
          console.log('🔄 Aplicando filtro pendiente:', this.filtros.categoria);
          this.aplicarFiltros();
        }
      },
      error: (error) => {
        this.error = 'Error al cargar productos del servidor';
        this.loading = false;
      }
    });
  }

 aplicarFiltros() {
  console.log('🔍 Aplicando filtros:', this.filtros);
  
  this.productos = this.productosOriginal.filter(prod => {
    // Hacer comparación case-insensitive para categoría
    const matchCategoria = this.filtros.categoria ? 
      prod.clasificacion.toLowerCase() === this.filtros.categoria.toLowerCase() : true;
    
    const matchPrecioMin = this.filtros.precioMin != null ? prod.precio >= this.filtros.precioMin : true;
    const matchPrecioMax = this.filtros.precioMax != null ? prod.precio <= this.filtros.precioMax : true;
    const matchNombre = this.filtros.nombre ? prod.nombre.toLowerCase().includes(this.filtros.nombre.toLowerCase()) : true;
    const matchDescripcion = this.filtros.descripcion ? prod.descripcion.toLowerCase().includes(this.filtros.descripcion.toLowerCase()) : true;
    
    return matchCategoria && matchPrecioMin && matchPrecioMax && matchNombre && matchDescripcion;
  });
  
  console.log('✅ Productos filtrados:', this.productos.length);
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
  
  // Limpiar query params si existen
  this.router.navigate(['/productos']);
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

toastMensaje = '';
mostrarToast = false;

agregarAlCarrito(producto: Producto) {
  this.carritoService.agregarProducto(producto, 1);
  this.toastMensaje = `${producto.nombre} agregado al carrito`;
  this.mostrarToast = true;
  setTimeout(() => {
    this.mostrarToast = false;
  }, 3000); // se oculta a los 3 segundos
}


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
