import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Producto } from '../../../modules/productos/interfaces/producto.interface';
import { ProductoRest } from './interfaces/producto.interface.rest';
import { ProductoMapper } from './mappings/producto.mapper';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  // Datos mock como fallback (siguiendo patrón del profesor)
  productos: ProductoRest[] = [
    {
      id: 1,
      nombre: "Remera Básica",
      descripcion: "Remera de algodón 100%, cómoda y versátil para uso diario",
      clasificacion: "Remeras",
      precio: 2500,
      imagen: "remera.jpg"
    },
    {
      id: 2,
      nombre: "Jean Clásico",
      descripcion: "Jean de mezclilla resistente, corte clásico y cómodo",
      clasificacion: "Pantalones",
      precio: 4500,
      imagen: "jean.jpg"
    },
    {
      id: 3,
      nombre: "Buzo con Capucha",
      descripcion: "Buzo con capucha, diseño argentino, ideal para el frío",
      clasificacion: "Buzos",
      precio: 3200,
      imagen: "buzo.jpg"
    }
  ];

  http = inject(HttpClient);

  constructor() { }

  /**
   * Obtener todos los productos
   */
  listProductos(): Observable<Producto[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<ProductoRest[]>(`${environment.api_url}/producto/`, { headers })
      .pipe(
        map((res) => {
          return ProductoMapper.mapRestProductoArrayToProductoArray(res);
        }),
        catchError((error) => {
          console.error('Error al obtener productos del backend, usando datos mock:', error);
          return of(ProductoMapper.mapRestProductoArrayToProductoArray(this.productos));
        })
      );
  }

  /**
   * Obtener producto por ID
   */
  getProducto(id: number | null): Observable<Producto> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<ProductoRest>(`${environment.api_url}/producto/${id}`, { headers })
      .pipe(
        map((res) => {
          return ProductoMapper.mapRestProductoToProducto(res);
        }),
        catchError((error) => {
          console.error('Error al obtener producto del backend, usando datos mock:', error);
          const mockProduct = this.productos.find(p => p.id === id);
          return of(mockProduct ? ProductoMapper.mapRestProductoToProducto(mockProduct) : {} as Producto);
        })
      );
  }

  /**
   * Obtener productos por categoría
   */
  getProductosPorCategoria(categoria: string): Observable<Producto[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<ProductoRest[]>(`${environment.api_url}/producto/categoria/${categoria}`, { headers })
      .pipe(
        map((res) => {
          return ProductoMapper.mapRestProductoArrayToProductoArray(res);
        }),
        catchError((error) => {
          console.error('Error al obtener productos por categoría, usando datos mock:', error);
          const filteredProducts = this.productos.filter(p => p.clasificacion.toLowerCase() === categoria.toLowerCase());
          return of(ProductoMapper.mapRestProductoArrayToProductoArray(filteredProducts));
        })
      );
  }

  /**
   * Crear nuevo producto
   */
  createProducto(producto: ProductoRest): Observable<Producto> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<ProductoRest>(`${environment.api_url}/producto/`, producto, { headers })
      .pipe(
        map((res) => {
          return ProductoMapper.mapRestProductoToProducto(res);
        }),
        catchError((error) => {
          console.error('Error al crear producto en backend, usando localStorage:', error);
          
          // Fallback: usar localStorage
          const productos = JSON.parse(localStorage.getItem('productos') || '[]');
          
          const newProduct: ProductoRest = {
            ...producto,
            id: Date.now()
          };

          productos.push(newProduct);
          localStorage.setItem('productos', JSON.stringify(productos));
          
          return of(ProductoMapper.mapRestProductoToProducto(newProduct));
        })
      );
  }

  /**
   * Actualizar producto
   */
  updateProducto(producto: Producto): Observable<Producto> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

    const productoRest = ProductoMapper.mapProductoToRestProducto(producto);

    return this.http.put<ProductoRest>(`${environment.api_url}/producto/${producto.id}`, productoRest, { headers })
      .pipe(
        map((res) => {
          return ProductoMapper.mapRestProductoToProducto(res);
        })
      );
  }

  /**
   * Eliminar producto
   */
  eliminarProducto(producto: Producto): Observable<Producto> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.delete<ProductoRest>(`${environment.api_url}/producto/${producto.id}`, { headers })
      .pipe(
        map((res) => {
          return ProductoMapper.mapRestProductoToProducto(res);
        })
      );
  }

  /**
   * Buscar productos por nombre
   */
  buscarProductos(termino: string): Observable<Producto[]> {
    return this.listProductos().pipe(
      map(productos => productos.filter(p => 
        p.nombre.toLowerCase().includes(termino.toLowerCase()) ||
        p.clasificacion.toLowerCase().includes(termino.toLowerCase())
      ))
    );
  }
}
