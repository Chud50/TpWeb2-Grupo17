import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  nombre: string = '';
  apellido: string = '';
  direccion: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.error = '';
    if (!this.nombre || !this.apellido || !this.direccion || !this.email || !this.password) {
      this.error = 'Por favor, completa todos los campos.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }
     if (!this.authService.register(this.email, this.password, this.nombre, this.apellido, this.direccion)) {
      this.error = 'El usuario ya existe';
      return;
    }
    alert('¡Usuario registrado con éxito!');
    this.router.navigate(['/login']);
  }

  volverAlLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}
