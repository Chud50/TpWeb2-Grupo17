import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../api/services/auth/auth.service';

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

  async onRegister() {
    this.error = '';
    if (!this.nombre || !this.apellido || !this.direccion || !this.email || !this.password) {
      this.error = 'Por favor, completa todos los campos.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }
    
    try {
      console.log('🐛 DEBUG: Iniciando registro...');
      const result = await this.authService.register({
        email: this.email,
        password: this.password,
        nombre: this.nombre,
        apellido: this.apellido,
        direccion: this.direccion
      }).toPromise();
      console.log('🐛 DEBUG: Resultado del registro:', result);
      
      if (result && result.success) {
        alert(result.message || '¡Usuario registrado con éxito!');
        this.router.navigate(['/login']);
      } else {
        this.error = result?.message || 'Error al registrar usuario';
      }
    } catch (error) {
      console.error('Error en registro:', error);
      this.error = 'Error al conectar con el servidor';
    }
  }

  volverAlLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}
