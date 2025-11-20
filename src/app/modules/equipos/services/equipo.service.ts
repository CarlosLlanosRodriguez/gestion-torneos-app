import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { StorageService } from '../../../core/services/storage.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Equipo, EquipoForm, EquipoListado, EquipoResponse } from '../models/equipo.model';
import { ApiResponse } from '../../../core/models/api-response.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class EquipoService {
  private apiUrl = `${environment.apiUrl}/equipos`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router,
    private authService: AuthService
  ) {}

  // Obtiene los headers con autenticación
  private getAuthHeaders() {
    const token = this.storageService.getItem<string>(environment.tokenKey);
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Obtener todos los equipos
  getEquipos(): Observable<{ equipos: EquipoListado[]; total: number }> {
    return this.http.get<ApiResponse<EquipoListado[]>>(this.apiUrl).pipe(
      map((response) => ({
        equipos: response.data,
        total: response.total || 0,
      })),
      catchError(this.handleError.bind(this))
    );
  }

  // Obtener equipo por id
  getEquipoPorId(id: number): Observable<Equipo> {
    return this.http.get<ApiResponse<Equipo>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data),
      catchError(this.handleError.bind(this))
    );
  }

  // Crear equipo (requiere autenticación)
  crearEquipo(equipo: EquipoForm): Observable<EquipoResponse> {
    const headers = this.getAuthHeaders();

    return this.http
      .post<ApiResponse<EquipoResponse>>(this.apiUrl, equipo, { headers })
      .pipe(
        map((response) => response.data),
        catchError(this.handleError.bind(this))
      );
  }

  // Actualizar equipo (requiere autenticación)
  actualizarEquipo(id: number, equipo: EquipoForm): Observable<EquipoResponse> {
    const headers = this.getAuthHeaders();

    return this.http
      .put<ApiResponse<EquipoResponse>>(`${this.apiUrl}/${id}`, equipo, {
        headers,
      })
      .pipe(
        map((response) => response.data),
        catchError(this.handleError.bind(this))
      );
  }

  // Eliminar equipo (requiere autenticación)
  eliminarEquipo(id: number): Observable<void> {
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
