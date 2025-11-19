import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../../../core/services/storage.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CambiarPasswordForm, UsuarioForm, UsuarioListado, UsuarioResponse } from '../models/usuario-listado.model';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Usuario } from '../../../core/models/usuario.model';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  // Obtiene los headers con autenticación
  private getAuthHeaders() {
    const token = this.storageService.getItem<string>(environment.tokenKey);
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // OBTENER TODOS LOS USUARIOS
  getUsuarios(): Observable<{ usuarios: UsuarioListado[]; total: number }> {
    const headers = this.getAuthHeaders();

    return this.http
      .get<ApiResponse<UsuarioListado[]>>(this.apiUrl, { headers })
      .pipe(
        map((response) => ({
          usuarios: response.data,
          total: response.total || 0,
        })),
        catchError(this.handleError.bind(this))
      );
  }

  // OBTENER USUARIO POR ID
  getUsuarioPorId(id: number): Observable<UsuarioListado> {
    const headers = this.getAuthHeaders();

    return this.http
      .get<ApiResponse<UsuarioListado>>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        map((response) => response.data),
        catchError(this.handleError.bind(this))
      );
  }

  // CREAR USUARIO
  crearUsuario(usuario: UsuarioForm): Observable<UsuarioResponse> {
    const headers = this.getAuthHeaders();

    return this.http
      .post<ApiResponse<UsuarioResponse>>(this.apiUrl, usuario, { headers })
      .pipe(
        map((response) => response.data),
        catchError(this.handleError.bind(this))
      );
  }

  // ACTUALIZAR USUARIO
  actualizarUsuario(id: number, usuario: UsuarioForm): Observable<UsuarioResponse> {
    const headers = this.getAuthHeaders();

    return this.http
      .put<ApiResponse<UsuarioResponse>>(`${this.apiUrl}/${id}`, usuario, { headers })
      .pipe(
        map((response) => response.data),
        catchError(this.handleError.bind(this))
      );
  }

  // CAMBIAR CONTRASEÑA DE USUARIO
  cambiarPassword(id: number, data: CambiarPasswordForm): Observable<void> {
    const headers = this.getAuthHeaders();

    return this.http
      .put<ApiResponse<void>>(`${this.apiUrl}/${id}/password`, data, {
        headers,
      })
      .pipe(
        map(() => undefined),
        catchError(this.handleError.bind(this))
      );
  }

  // ELIMINAR USUARIO
  eliminarUsuario(id: number): Observable<void> {
    const headers = this.getAuthHeaders();

    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        map(() => undefined),
        catchError(this.handleError.bind(this))
      );
  }

  // Manejo de errores HTTP
  private handleError(error: HttpErrorResponse) {
    console.log('Error', error);
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.status === 400) {
      errorMessage =
        error.error.errors.map((err: any) => err.msg).join('\n') ||
        'Errores de validación';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#dc3545',
      });
    } else {
      errorMessage = error.error.message;
      if (error.status === 401) this.authService.logout();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#dc3545',
      });
    }

    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      errors: error.error?.errors,
    }));
  }

}
