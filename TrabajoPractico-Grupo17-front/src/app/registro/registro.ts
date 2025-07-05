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
  toastMensaje: string = '';
  mostrarToast: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  private validarPassword(password: string): string | null {
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula.';
    }
    if (!/[0-9]/.test(password)) {
      return 'La contraseña debe contener al menos un número.';
    }
    return null;
  }

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

    const passwordError = this.validarPassword(this.password);
    if (passwordError) {
      this.error = passwordError;
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
        this.toastMensaje = result.message || '¡Usuario registrado con éxito!';
        this.mostrarToast = true;
        setTimeout(() => {
          this.mostrarToast = false;
          this.router.navigate(['/login']); // Navegar después de ocultar el toast
        }, 3000);
      } else {
        this.toastMensaje = result?.message || 'Error al registrar usuario';
        this.mostrarToast = true;
        setTimeout(() => {
          this.mostrarToast = false;
        }, 3000);
      }
    } catch (error) {
      console.error('Error en registro:', error);
      this.toastMensaje = 'Error al conectar con el servidor';
      this.mostrarToast = true;
      setTimeout(() => {
        this.mostrarToast = false;
      }, 3000);
    }
  }

  volverAlLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }


}
