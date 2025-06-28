import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Usuario } from '../../../modules/usuarios/interfaces/usuario.interface';
import { UsuarioRest } from './interfaces/usuario.interface.rest';
import { UsuarioMapper } from './mappings/usuario.mapper';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // Datos mock como fallback (siguiendo patrón del profesor)
  usuarios = [
    {
      id: 1,
      email: "test@test.com",
      password: "123456",
      nombre: "Test",
      apellido: "User",
      direccion: "123 Test St"
    },
    {
      id: 2,
      email: "admin@admin.com", 
      password: "admin",
      nombre: "Admin",
      apellido: "User",
      direccion: "456 Admin Ave"
    }
  ];

  http = inject(HttpClient);

  constructor() { }

  /**
   * Obtener todos los usuarios
   */
  listUsuarios(): Observable<Usuario[]> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<UsuarioRest[]>(`${environment.api_url}/usuario/`, { headers })
      .pipe(
        map((res) => {
          return UsuarioMapper.mapRestUsuarioRestArrayToUsuarioArray(res);
        }),
        catchError((error) => {
          console.error('Error al obtener usuarios del backend, usando datos mock:', error);
          return of(UsuarioMapper.mapRestUsuarioRestArrayToUsuarioArray(this.usuarios));
        })
      );
  }

  /**
   * Obtener usuario por ID
   */
  getUsuario(id: number | null): Observable<Usuario> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<UsuarioRest>(`${environment.api_url}/usuario/${id}`, { headers })
      .pipe(
        map((res) => {
          return UsuarioMapper.mapRestUsuarioToUsuario(res);
        }),
        catchError((error) => {
          console.error('Error al obtener usuario del backend, usando datos mock:', error);
          const mockUser = this.usuarios.find(u => u.id === id);
          return of(mockUser ? UsuarioMapper.mapRestUsuarioToUsuario(mockUser) : {} as Usuario);
        })
      );
  }

  /**
   * Obtener usuario por email
   */
  getUsuarioByEmail(email: string): Observable<Usuario | null> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<UsuarioRest>(`${environment.api_url}/usuario/${encodeURIComponent(email)}`, { headers })
      .pipe(
        map((res) => {
          return res ? UsuarioMapper.mapRestUsuarioToUsuario(res) : null;
        }),
        catchError((error) => {
          console.error('Error al obtener usuario del backend, usando datos mock:', error);
          const mockUser = this.usuarios.find(u => u.email === email);
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const localUser = users.find((u: any) => u.email === email);
          
          const foundUser = mockUser || localUser;
          return of(foundUser ? UsuarioMapper.mapRestUsuarioToUsuario(foundUser) : null);
        })
      );
  }

  /**
   * Crear nuevo usuario
   */
  createUsuario(usuario: UsuarioRest): Observable<Usuario> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<UsuarioRest>(`${environment.api_url}/usuario/`, usuario, { headers })
      .pipe(
        map((res) => {
          return UsuarioMapper.mapRestUsuarioToUsuario(res);
        }),
        catchError((error) => {
          console.error('Error al crear usuario en backend, usando localStorage:', error);
          
          // Fallback: usar localStorage
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          
          // Verificar si el usuario ya existe
          if (users.find((u: any) => u.email === usuario.email)) {
            throw new Error('Usuario ya existe');
          }

          const newUser: UsuarioRest = {
            ...usuario,
            id: Date.now()
          };

          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));
          
          return of(UsuarioMapper.mapRestUsuarioToUsuario(newUser));
        })
      );
  }

  /**
   * Actualizar usuario
   */
  updateUsuario(usuario: Usuario): Observable<Usuario> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.put<UsuarioRest>(`${environment.api_url}/usuario/${usuario.id}`, usuario, { headers })
      .pipe(
        map((res) => {
          return UsuarioMapper.mapRestUsuarioToUsuario(res);
        })
      );
  }

  /**
   * Eliminar usuario
   */
  eliminarUsuario(usuario: Usuario): Observable<Usuario> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.delete<UsuarioRest>(`${environment.api_url}/usuario/${usuario.id}`, { headers })
      .pipe(
        map((res) => {
          return UsuarioMapper.mapRestUsuarioToUsuario(res);
        })
      );
  }
}
