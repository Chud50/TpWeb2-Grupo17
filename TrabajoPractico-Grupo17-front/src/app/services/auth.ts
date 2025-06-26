import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Usuario {
  id?: number;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  direccion: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/usuario';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    // Verificar si hay una sesión activa
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.isLoggedInSubject.next(true);
    }
  }

  async register(email: string, password: string, nombre: string, apellido: string, direccion: string): Promise<boolean> {
    try {
      // Intentar registrar en el backend
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, nombre, apellido, direccion })
      });

      if (response.ok) {
        const newUser = await response.json();
        console.log('Usuario registrado en backend:', newUser);
        return true;
      } else {
        throw new Error('Error en el backend');
      }
    } catch (error) {
      console.error('Error al registrar en backend, usando localStorage:', error);
      
      // Fallback: usar localStorage
      const users = this.getUsers();
      if (users.find(u => u.email === email)) {
        return false; // Usuario ya existe
      }
      users.push({ email, password, nombre, apellido, direccion });
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Usuario registrado en localStorage');
      return true;
    }
  }   

  async login(email: string, password: string): Promise<boolean> {
    try {
      // Intentar login desde el backend
      const response = await fetch(this.apiUrl);
      
      if (response.ok) {
        const usuarios = await response.json();
        console.log('Usuarios obtenidos del backend:', usuarios.length);
        
        const user = usuarios.find((u: Usuario) => u.email === email && u.password === password);
        if (user) {
          this.setLoggedIn(user);
          console.log('Login exitoso desde backend');
          return true;
        } else {
          console.log('Usuario no encontrado en backend');
          return false;
        }
      } else {
        throw new Error('Backend no disponible');
      }
    } catch (error) {
      console.error('Error al hacer login desde backend, usando localStorage:', error);
      
      // Fallback: usar localStorage
      const users = this.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        this.setLoggedIn(user);
        console.log('Login exitoso desde localStorage');
        return true;
      }
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.isLoggedInSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  setLoggedIn(user: Usuario): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.isLoggedInSubject.next(true);
  }

  private getUsers(): Usuario[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }
}
