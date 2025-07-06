import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ProductoService } from '../api/services/producto/producto.service';
import { CarritoService } from '../api/services/carrito/carrito.service';
import { AuthService } from '../api/services/auth/auth.service';
import { Producto } from '../modules/productos/interfaces/producto.interface';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar';
import { FooterComponent } from '../shared/footer/footer';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
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
    // Primero cargamos filtros desde URL
    this.cargarFiltrosDesdeQueryParams();
    
    // Luego cargamos productos
    this.cargarProductos();
    
    // Finalmente actualizamos carrito
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
        
        console.log('📦 Productos cargados desde BD:', productos.length);
        console.log('🔍 Filtros actuales:', this.filtros);
        
        // SIEMPRE aplicar filtros después de cargar, aunque estén vacíos
        this.aplicarFiltrosSinActualizarURL();
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
    const matchCategoria = this.filtros.categoria ? prod.clasificacion.toLowerCase() === this.filtros.categoria.toLowerCase() : true;
    const matchPrecioMin = this.filtros.precioMin != null ? prod.precio >= this.filtros.precioMin : true;
    const matchPrecioMax = this.filtros.precioMax != null ? prod.precio <= this.filtros.precioMax : true;
    const matchNombre = this.filtros.nombre ? prod.nombre.toLowerCase().includes(this.filtros.nombre.toLowerCase()) : true;
    const matchDescripcion = this.filtros.descripcion ? prod.descripcion.toLowerCase().includes(this.filtros.descripcion.toLowerCase()) : true;
    
    return matchCategoria && matchPrecioMin && matchPrecioMax && matchNombre && matchDescripcion;
  });
  
  console.log('✅ Productos filtrados:', this.productos.length);
  
  // Actualizar query params para persistir filtros
  this.actualizarQueryParams();
}

limpiarFiltros() {
  console.log('🧹 Limpiando todos los filtros');
  
  this.filtros = {
    categoria: '',
    precioMin: null,
    precioMax: null,
    nombre: '',
    descripcion: ''
  };
  
  this.productos = [...this.productosOriginal];
  
  // Limpiar query params completamente
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

  /**
   * Actualiza los query parameters con los filtros actuales
   */
  actualizarQueryParams() {
    const queryParams: any = {};
    
    // Solo agregar parámetros si tienen valor
    if (this.filtros.categoria) {
      queryParams.categoria = this.filtros.categoria;
    }
    if (this.filtros.precioMin != null) {
      queryParams.precioMin = this.filtros.precioMin;
    }
    if (this.filtros.precioMax != null) {
      queryParams.precioMax = this.filtros.precioMax;
    }
    if (this.filtros.nombre) {
      queryParams.nombre = this.filtros.nombre;
    }
    if (this.filtros.descripcion) {
      queryParams.descripcion = this.filtros.descripcion;
    }
    
    // Navegar sin recargar la página
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'replace'
    });
    
    console.log('🔗 Query params actualizados:', queryParams);
  }

  /**
   * Carga todos los filtros desde query parameters
   */
  cargarFiltrosDesdeQueryParams() {
    this.route.queryParams.subscribe(params => {
      console.log('📥 Cargando filtros desde query params:', params);
      
      // Solo actualizar si realmente hay parámetros en la URL
      const hasParams = Object.keys(params).length > 0;
      
      if (hasParams) {
        this.filtros.categoria = params['categoria'] || '';
        this.filtros.precioMin = params['precioMin'] ? Number(params['precioMin']) : null;
        this.filtros.precioMax = params['precioMax'] ? Number(params['precioMax']) : null;
        this.filtros.nombre = params['nombre'] || '';
        this.filtros.descripcion = params['descripcion'] || '';
        
        console.log('🔄 Filtros cargados desde URL:', this.filtros);
      } else {
        console.log('📭 No hay parámetros en URL, manteniendo filtros actuales');
      }
      
      // Aplicar filtros si hay productos cargados
      if (this.productosOriginal.length > 0) {
        this.aplicarFiltrosSinActualizarURL();
      }
    });
  }

  /**
   * Aplica filtros sin actualizar URL (para evitar bucle infinito)
   */
  aplicarFiltrosSinActualizarURL() {
    console.log('🔍 Aplicando filtros sin actualizar URL:', this.filtros);
    
    this.productos = this.productosOriginal.filter(prod => {
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

  /**
   * Verifica si hay algún filtro activo
   */
  tieneAlgunFiltroActivo(): boolean {
    return !!(
      this.filtros.categoria ||
      this.filtros.precioMin != null ||
      this.filtros.precioMax != null ||
      this.filtros.nombre ||
      this.filtros.descripcion
    );
  }
}
