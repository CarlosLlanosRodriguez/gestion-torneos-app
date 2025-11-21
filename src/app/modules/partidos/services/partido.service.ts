import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { StorageService } from '../../../core/services/storage.service';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Partido, PartidoCreateForm, PartidoListado, PartidoResponse, PartidoUpdateForm } from '../models/partido.model';
import { ApiResponse } from '../../../core/models/api-response.model';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PartidoService {
  private apiUrl = `${environment.apiUrl}/partidos`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router,
    private authService: AuthService
  ) {}

  private getAuthHeaders() {
    const token = this.storageService.getItem<string>(environment.tokenKey);
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // obtener todos los partidos
  getPartidos(): Observable<{ partidos: PartidoListado[]; total: number }> {
    return this.http.get<ApiResponse<PartidoListado[]>>(this.apiUrl).pipe(
      map((response) => ({
        partidos: response.data,
        total: response.total || 0,
      })),
      catchError(this.handleError.bind(this))
    );
  }

  // obtener partido por id
  getPartidoPorId(id: number): Observable<Partido> {
    return this.http.get<ApiResponse<Partido>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data),
      catchError(this.handleError.bind(this))
    );
  }

  // obtener partidos por torneo
  getPartidosPorTorneo(
    torneoId: number
  ): Observable<{ partidos: PartidoListado[]; total: number }> {
    return this.http
      .get<ApiResponse<PartidoListado[]>>(`${this.apiUrl}/torneo/${torneoId}`)
      .pipe(
        map((response) => ({
          partidos: response.data,
          total: response.total || 0,
        })),
        catchError(this.handleError.bind(this))
      );
  }

  // crear partido (requiere autenticación)
  crearPartido(partido: PartidoCreateForm): Observable<PartidoResponse> {
    const headers = this.getAuthHeaders();

    return this.http
      .post<ApiResponse<PartidoResponse>>(this.apiUrl, partido, { headers })
      .pipe(
        map((response) => response.data),
        catchError(this.handleError.bind(this))
      );
  }

  // actualizar partido (requiere autenticación)
  actualizarPartido(
    id: number,
    partido: PartidoUpdateForm
  ): Observable<PartidoResponse> {
    const headers = this.getAuthHeaders();

    return this.http
      .put<ApiResponse<PartidoResponse>>(`${this.apiUrl}/${id}`, partido, {
        headers,
      })
      .pipe(
        map((response) => response.data),
        catchError(this.handleError.bind(this))
      );
  }

  // eliminar partido (requiere autenticación)
  eliminarPartido(id: number): Observable<void> {
    const headers = this.getAuthHeaders();

    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        map(() => undefined),
        catchError(this.handleError.bind(this))
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.log('Error', error);
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.status === 400) {
      console.log('entra', errorMessage);          
      errorMessage = error.error.errors
        ? error.error.errors.map((err: any) => err.msg).join('\n')
        : error.error.message;
      console.log(errorMessage);      
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
