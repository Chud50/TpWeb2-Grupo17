import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto } from '../../../modules/productos/interfaces/producto.interface';
import { Carrito, CarritoItem } from '../../../modules/carrito/interfaces/carrito.interface';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  
  private readonly STORAGE_KEY = 'carrito_data';
  
  // Estado reactivo del carrito (siguiendo patrón del profesor)
  private carritoSubject = new BehaviorSubject<Carrito>(this.getCarritoInicial());
  public carrito$ = this.carritoSubject.asObservable();
  
  constructor() {
    this.cargarCarritoDesdeStorage();
  }

  /**
   * Obtener carrito inicial vacío
   */
  private getCarritoInicial(): Carrito {
    return {
      id: this.generarId(),
      items: [],
      total: 0,
      cantidadTotal: 0,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };
  }

  /**
   * Cargar carrito desde localStorage
   */
  private cargarCarritoDesdeStorage(): void {
    try {
      const carritoGuardado = localStorage.getItem(this.STORAGE_KEY);
      if (carritoGuardado) {
        const carrito = JSON.parse(carritoGuardado);
        // Convertir fechas de string a Date
        carrito.fechaCreacion = new Date(carrito.fechaCreacion);
        carrito.fechaActualizacion = new Date(carrito.fechaActualizacion);
        this.carritoSubject.next(carrito);
      }
    } catch (error) {
      console.error('Error al cargar carrito desde localStorage:', error);
      this.carritoSubject.next(this.getCarritoInicial());
    }
  }

  /**
   * Guardar carrito en localStorage
   */
  private guardarCarritoEnStorage(carrito: Carrito): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(carrito));
    } catch (error) {
      console.error('Error al guardar carrito en localStorage:', error);
    }
  }

  /**
   * Generar ID único
   */
  private generarId(): string {
    return 'carrito_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Calcular totales del carrito
   */
  private calcularTotales(carrito: Carrito): Carrito {
    const total = carrito.items.reduce((sum: number, item: CarritoItem) => sum + item.subtotal, 0);
    const cantidadTotal = carrito.items.reduce((sum: number, item: CarritoItem) => sum + item.cantidad, 0);
    
    return {
      ...carrito,
      total,
      cantidadTotal,
      fechaActualizacion: new Date()
    };
  }

  /**
   * Actualizar carrito y persistir
   */
  private actualizarCarrito(carrito: Carrito): void {
    const carritoConTotales = this.calcularTotales(carrito);
    this.carritoSubject.next(carritoConTotales);
    this.guardarCarritoEnStorage(carritoConTotales);
  }

  /**
   * Obtener carrito actual
   */
  getCarrito(): Observable<Carrito> {
    return this.carrito$;
  }

  /**
   * Obtener carrito actual de forma síncrona
   */
  getCarritoActual(): Carrito {
    return this.carritoSubject.value;
  }

  /**
   * Agregar producto al carrito
   */
  agregarProducto(producto: Producto, cantidad: number = 1): void {
    const carritoActual = this.getCarritoActual();
    const itemExistente = carritoActual.items.find((item: CarritoItem) => item.producto.id === producto.id);

    if (itemExistente) {
      // Si ya existe, aumentar cantidad
      itemExistente.cantidad += cantidad;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.producto.precio;
    } else {
      // Si no existe, crear nuevo item
      const nuevoItem: CarritoItem = {
        id: this.generarId(),
        producto,
        cantidad,
        subtotal: cantidad * producto.precio
      };
      carritoActual.items.push(nuevoItem);
    }

    this.actualizarCarrito(carritoActual);
    console.log(`✅ Producto agregado al carrito: ${producto.nombre} (cantidad: ${cantidad})`);
  }

  /**
   * Quitar cantidad de un producto
   */
  quitarProducto(productoId: number, cantidad: number = 1): void {
    const carritoActual = this.getCarritoActual();
    const itemIndex = carritoActual.items.findIndex((item: CarritoItem) => item.producto.id === productoId);

    if (itemIndex !== -1) {
      const item = carritoActual.items[itemIndex];
      item.cantidad -= cantidad;

      if (item.cantidad <= 0) {
        // Si la cantidad es 0 o menor, eliminar el item
        carritoActual.items.splice(itemIndex, 1);
      } else {
        // Actualizar subtotal
        item.subtotal = item.cantidad * item.producto.precio;
      }

      this.actualizarCarrito(carritoActual);
      console.log(`➖ Producto cantidad reducida: ${item.producto.nombre}`);
    }
  }

  /**
   * Eliminar producto completamente del carrito
   */
  eliminarProducto(productoId: number): void {
    const carritoActual = this.getCarritoActual();
    carritoActual.items = carritoActual.items.filter((item: CarritoItem) => item.producto.id !== productoId);
    
    this.actualizarCarrito(carritoActual);
    console.log(`🗑️ Producto eliminado del carrito: ID ${productoId}`);
  }

  /**
   * Limpiar carrito completamente
   */
  limpiarCarrito(): void {
    const carritoLimpio = this.getCarritoInicial();
    this.actualizarCarrito(carritoLimpio);
    console.log('🧹 Carrito limpiado');
  }

  /**
   * Actualizar cantidad específica de un producto
   */
  actualizarCantidad(productoId: number, nuevaCantidad: number): void {
    if (nuevaCantidad <= 0) {
      this.eliminarProducto(productoId);
      return;
    }

    const carritoActual = this.getCarritoActual();
    const item = carritoActual.items.find((item: CarritoItem) => item.producto.id === productoId);

    if (item) {
      item.cantidad = nuevaCantidad;
      item.subtotal = item.cantidad * item.producto.precio;
      this.actualizarCarrito(carritoActual);
      console.log(`🔄 Cantidad actualizada: ${item.producto.nombre} = ${nuevaCantidad}`);
    }
  }

  /**
   * Verificar si un producto está en el carrito
   */
  estaEnCarrito(productoId: number): boolean {
    return this.getCarritoActual().items.some((item: CarritoItem) => item.producto.id === productoId);
  }

  /**
   * Obtener cantidad de un producto específico en el carrito
   */
  getCantidadProducto(productoId: number): number {
    const item = this.getCarritoActual().items.find((item: CarritoItem) => item.producto.id === productoId);
    return item ? item.cantidad : 0;
  }
}
