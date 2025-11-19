import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { StorageService } from '../../../core/services/storage.service';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Torneo, TorneoForm, TorneoListado, TorneoResponse } from '../models/torneo.model';
import { ApiResponse } from '../../../core/models/api-response.model';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TorneoService {
  private apiUrl = `${environment.apiUrl}/torneos`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router,
    private authServices: AuthService
  ) {}

  // Obtiene los headers con autenticación
  private getAuthHeaders() {
    const token = this.storageService.getItem<string>(environment.tokenKey);
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Obtener todos los torneos
  getTorneos(): Observable<{ torneos: TorneoListado[]; total: number }> {
    return this.http.get<ApiResponse<TorneoListado[]>>(this.apiUrl).pipe(
      map((response) => ({
        torneos: response.data,
        total: response.total || 0,
      })),
      catchError(this.handleError.bind(this))
    );
  }

  // Obtener torneo por ID
  getTorneoPorId(id: number): Observable<Torneo> {
    return this.http.get<ApiResponse<Torneo>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data),
      catchError(this.handleError.bind(this))
    );
  }

  // Obtener mis torneos (requiere autenticación)
  getMisTorneos(): Observable<{ torneos: TorneoListado[]; total: number }> {
    const headers = this.getAuthHeaders();

    return this.http
      .get<ApiResponse<TorneoListado[]>>(`${this.apiUrl}/obtener/mis-torneos`, {
        headers,
      })
      .pipe(
        map((response) => ({
          torneos: response.data,
          total: response.total || 0,
        })),
        catchError(this.handleError.bind(this))
      );
  }

  // Obtener torneos por estado
  getTorneosPorEstado(
    estado: string
  ): Observable<{ torneos: TorneoListado[]; total: number }> {
    return this.http
      .get<ApiResponse<TorneoListado[]>>(`${this.apiUrl}/estado/${estado}`)
      .pipe(
        map((response) => ({
          torneos: response.data,
          total: response.total || 0,
        })),
        catchError(this.handleError.bind(this))
      );
  }

  // Crear torneo (requiere autenticación)
  crearTorneo(torneo: TorneoForm): Observable<TorneoResponse> {
    const headers = this.getAuthHeaders();

    return this.http
      .post<ApiResponse<TorneoResponse>>(this.apiUrl, torneo, { headers })
      .pipe(
        map((response) => response.data),
        catchError(this.handleError.bind(this))
      );
  }

  // Actualizar torneo (requiere autenticación)
  actualizarTorneo(id: number, torneo: TorneoForm): Observable<TorneoResponse> {
    const headers = this.getAuthHeaders();

    return this.http
      .put<ApiResponse<TorneoResponse>>(`${this.apiUrl}/${id}`, torneo, {
        headers,
      })
      .pipe(
        map((response) => response.data),
        catchError(this.handleError.bind(this))
      );
  }

  // Eliminar torneo (requiere autenticación)
  eliminarTorneo(id: number): Observable<void> {
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
      if (error.status === 401) this.authServices.logout();
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
