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
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    // Verificar si hay una sesión activa
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.isLoggedInSubject.next(true);
    }
  }

  register(email: string, password: string, nombre: string, apellido: string, direccion: string): boolean {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) {
      return false; // Usuario ya existe
    }
    users.push({ email, password, nombre, apellido, direccion });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }   

  login(email: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      this.setLoggedIn(user);
      return true;
    }
    return false;
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
