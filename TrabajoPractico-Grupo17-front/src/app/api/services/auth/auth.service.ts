import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, BehaviorSubject, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Usuario } from '../../../modules/usuarios/interfaces/usuario.interface';
import { UsuarioRest } from '../usuario/interfaces/usuario.interface.rest';
import { UsuarioMapper } from '../usuario/mappings/usuario.mapper';
import { LoginRequest, RegisterRequest, AuthResponse, AuthState } from './interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  
  // Estado de autenticación reactivo
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });
  
  public authState$ = this.authStateSubject.asObservable();
  public isLoggedIn$ = this.authState$.pipe(map(state => state.isAuthenticated));

  constructor() {
    this.initializeAuthState();
  }

  /**
   * Inicializar estado desde localStorage
   */
  private initializeAuthState(): void {
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser);
        this.authStateSubject.next({
          isAuthenticated: true,
          user: user,
          token: savedToken
        });
      } catch (error) {
        console.error('Error parsing saved auth data:', error);
        this.clearAuthData();
      }
    }
  }

  /**
   * Login de usuario - Solo backend, sin fallback
   */
  login(loginData: LoginRequest): Observable<AuthResponse> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');

    // Obtener todos los usuarios y buscar por email/password
    return this.http.get<UsuarioRest[]>(`${environment.api_url}/usuario/`, { headers })
      .pipe(
        map((usuarios) => {
          // Buscar usuario que coincida con email y password
          const usuario = usuarios.find(u => 
            u.email === loginData.email && u.password === loginData.password
          );

          if (usuario) {
            const user = UsuarioMapper.mapRestUsuarioToUsuario(usuario);
            const token = 'jwt-token-' + Date.now();
            
            this.setAuthData(user, token);
            
            return {
              success: true,
              token: token,
              user: user,
              message: 'Login exitoso'
            };
          }
          
          return {
            success: false,
            message: 'Email o contraseña incorrectos'
          };
        }),
        catchError((error) => {
          console.error('Error en login:', error);
          return of({
            success: false,
            message: 'Error al conectar con el servidor'
          });
        })
      );
  }

  /**
   * Registro de usuario - Solo backend, sin fallback
   */
  register(registerData: RegisterRequest): Observable<AuthResponse> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');

    const usuarioRest: UsuarioRest = {
      email: registerData.email,
      password: registerData.password,
      nombre: registerData.nombre,
      apellido: registerData.apellido,
      direccion: registerData.direccion
    };

    // DEBUG: Ver qué datos estamos enviando
    console.log('🐛 DEBUG: Datos que se envían al backend:', JSON.stringify(usuarioRest, null, 2));
    console.log('🐛 DEBUG: URL:', `${environment.api_url}/usuario/`);
    console.log('🐛 DEBUG: Headers:', headers);

    return this.http.post<UsuarioRest>(`${environment.api_url}/usuario/`, usuarioRest, { headers })
      .pipe(
        map((response) => {
          console.log('✅ Respuesta exitosa del backend:', response);
          console.log('✅ Tipo de respuesta:', typeof response);
          console.log('✅ ¿Tiene ID?:', response && response.id);
          
          if (response && response.id) {
            const user = UsuarioMapper.mapRestUsuarioToUsuario(response);
            console.log('✅ Usuario mapeado:', user);
            
            return {
              success: true,
              user: user,
              message: 'Usuario registrado exitosamente'
            };
          }
          
          console.log('⚠️ Respuesta sin ID válido');
          return {
            success: false,
            message: 'Error al registrar usuario'
          };
        }),
        catchError((error) => {
          console.error('❌ Error completo en registro:', error);
          console.error('❌ Status:', error.status);
          console.error('❌ Error message:', error.message);
          console.error('❌ Error body:', error.error);
          
          // Error 409: Email ya existe (nuevo código de estado que agregamos)
          if (error.status === 409) {
            return of({
              success: false,
              message: 'El email ya está registrado. Por favor usa otro email.'
            });
          }
          
          // Error 400: Verificar si es por email duplicado (backward compatibility)
          if (error.status === 400) {
            if (error.error?.error?.code === 'P2002' || 
                error.error?.message?.includes('ya está registrado') ||
                error.error?.message?.includes('email')) {
              return of({
                success: false,
                message: 'El email ya está registrado. Por favor usa otro email.'
              });
            }
            return of({
              success: false,
              message: 'Datos inválidos. Verifica que todos los campos estén completos.'
            });
          }
          
          return of({
            success: false,
            message: 'Error al conectar con el servidor'
          });
        })
      );
  }

  /**
   * Logout
   */
  logout(): void {
    // En un app real, invalidaríamos el token en el backend
    this.clearAuthData();
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): Usuario | null {
    return this.authStateSubject.value.user;
  }

  /**
   * Obtener token actual
   */
  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  // MÉTODOS PRIVADOS

  private setAuthData(user: Usuario, token: string): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', token);
    
    this.authStateSubject.next({
      isAuthenticated: true,
      user: user,
      token: token
    });
  }

  private clearAuthData(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    
    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      token: null
    });
  }

  // MÉTODOS DE COMPATIBILIDAD (para que funcione con componentes existentes)
  
  /**
   * Login como promesa (para compatibilidad con componentes existentes)
   */
  async loginAsync(email: string, password: string): Promise<boolean> {
    try {
      const result = await this.login({ email, password }).toPromise();
      return result?.success || false;
    } catch (error) {
      console.error('Error en loginAsync:', error);
      return false;
    }
  }

  /**
   * Registro como promesa (para compatibilidad con componentes existentes)
   */
  async registerAsync(email: string, password: string, nombre: string, apellido: string, direccion: string): Promise<boolean> {
    try {
      const result = await this.register({ email, password, nombre, apellido, direccion }).toPromise();
      return result?.success || false;
    } catch (error) {
      console.error('Error en registerAsync:', error);
      return false;
    }
  }
}
