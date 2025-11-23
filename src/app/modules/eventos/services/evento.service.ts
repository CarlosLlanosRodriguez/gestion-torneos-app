import { Injectable } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { StorageService } from '../../../core/services/storage.service';
import { Router } from '@angular/router';
import { Evento, EventoForm, EventoListado, EventoResponse, Goleador } from '../models/evento.model';
import { ApiResponse } from '../../../core/models/api-response.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = `${environment.apiUrl}/eventos`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  private getAuthHeaders() {
    const token = this.storageService.getItem<string>(environment.tokenKey);
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // obtener todos los eventos
  getEventos(): Observable<{ eventos: EventoListado[], total: number }> {
    return this.http.get<ApiResponse<EventoListado[]>>(this.apiUrl)
      .pipe(
        map(response => ({
          eventos: response.data,
          total: response.total || 0
        })),
        catchError(this.handleError.bind(this))
      );
  }

  // obtener evento por id
  getEventoPorId(id: number): Observable<Evento> {
    return this.http.get<ApiResponse<Evento>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError.bind(this))
      );
  }

  // obtener eventos por partido
  getEventosPorPartido(partidoId: number): Observable<{ eventos: EventoListado[], total: number }> {
    return this.http.get<ApiResponse<EventoListado[]>>(`${this.apiUrl}/partido/${partidoId}`)
      .pipe(
        map(response => ({
          eventos: response.data,
          total: response.total || 0
        })),
        catchError(this.handleError.bind(this))
      );
  }

  // obtener goleadores por partido (público)
  getGoleadoresPorPartido(partidoId: number): Observable<{ goleadores: Goleador[], total: number }> {
    return this.http.get<ApiResponse<Goleador[]>>(`${this.apiUrl}/partido/${partidoId}/goleadores`)
      .pipe(
        map(response => ({
          goleadores: response.data,
          total: response.total || 0
        })),
        catchError(this.handleError.bind(this))
      );
  }

  // crear evento (requiere autenticación)
  crearEvento(evento: EventoForm): Observable<EventoResponse> {
    const headers = this.getAuthHeaders();
    
    return this.http.post<ApiResponse<EventoResponse>>(this.apiUrl, evento, { headers })
      .pipe(
        map(response => response.data),
        catchError(this.handleError.bind(this))
      );
  }

  // actualizar evento (requiere autenticación)
  actualizarEvento(id: number, evento: EventoForm): Observable<EventoResponse> {
    const headers = this.getAuthHeaders();
    
    return this.http.put<ApiResponse<EventoResponse>>(`${this.apiUrl}/${id}`, evento, { headers })
      .pipe(
        map(response => response.data),
        catchError(this.handleError.bind(this))
      );
  }

  // eliminar evento (requiere autenticación)
  eliminarEvento(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, { headers })
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
      errorMessage = error.error.errors.map((err: any) => err.msg).join('\n') || 'Errores de validación';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#dc3545'
      });
    } else {
      errorMessage = error.error.message;
      if(error.status === 401) this.authService.logout();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#dc3545'
      });
    }
    
    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      errors: error.error?.errors
    }));
  }
}
