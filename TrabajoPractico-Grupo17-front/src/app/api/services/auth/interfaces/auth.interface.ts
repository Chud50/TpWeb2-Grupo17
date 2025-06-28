/**
 * Interfaces para autenticación siguiendo patrón del profesor
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  direccion: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
}
