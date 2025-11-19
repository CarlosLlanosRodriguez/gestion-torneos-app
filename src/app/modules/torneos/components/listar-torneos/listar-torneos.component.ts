import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TorneoListado } from '../../models/torneo.model';
import { TorneoService } from '../../services/torneo.service';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { StorageService } from '../../../../core/services/storage.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-listar-torneos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listar-torneos.component.html',
  styleUrl: './listar-torneos.component.css',
})
export class ListarTorneosComponent implements OnInit {
  torneos: TorneoListado[] = [];
  loading = true;
  total = 0;

  constructor(
    private torneoService: TorneoService,
    public authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.cargarTorneos();
  }

  // Carga todos los torneos
  cargarTorneos(): void {
    this.loading = true;

    this.torneoService.getTorneos().subscribe({
      next: (response) => {
        this.torneos = response.torneos;
        this.total = response.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  // Elimina un torneo con confirmación
  eliminarTorneo(torneo: TorneoListado): void {
    Swal.fire({
      title: '¿Eliminar torneo?',
      text: `Se eliminará el torneo "${torneo.nombre}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.torneoService.eliminarTorneo(torneo.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'Torneo eliminado exitosamente',
              timer: 1500,
              showConfirmButton: false,
            });
            this.cargarTorneos();
          },
        });
      }
    });
  }

  // Badge de estado
  getEstadoBadgeClass(estado: string): string {
    const badges: { [key: string]: string } = {
      planificado: 'bg-info',
      en_curso: 'bg-success',
      finalizado: 'bg-secondary',
      cancelado: 'bg-danger',
    };
    return badges[estado] || 'bg-secondary';
  }

  // Formatea fecha
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  // Verifica si puede editar/eliminar
  puedeEditar(torneo: TorneoListado): boolean {
    if (!this.authService.isAuthenticated()) return false;

    const usuario: any = this.storageService.getItem(environment.userKey);

    // Admin puede todo
    if (usuario?.rol?.nombre === 'admin') return true;

    // Organizador solo sus torneos
    if (usuario?.rol?.nombre === 'organizador') {
      return usuario.id === torneo.organizador_id;
    }

    return false;
  }
}
