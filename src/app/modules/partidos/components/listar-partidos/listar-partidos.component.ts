import { Component } from '@angular/core';
import { PartidoListado } from '../../models/partido.model';
import { PartidoService } from '../../services/partido.service';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listar-partidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listar-partidos.component.html',
  styleUrl: './listar-partidos.component.css',
})
export class ListarPartidosComponent {
  partidos: PartidoListado[] = [];
  loading = true;
  total = 0;

  constructor(
    private partidoService: PartidoService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarPartidos();
  }

  cargarPartidos(): void {
    this.loading = true;
    this.partidoService.getPartidos().subscribe({
      next: (response) => {
        this.partidos = response.partidos;
        this.total = response.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getEstadoBadgeClass(estado: string): string {
    const badges: { [key: string]: string } = {
      pendiente: 'bg-warning',
      en_curso: 'bg-success',
      finalizado: 'bg-secondary',
      cancelado: 'bg-danger',
    };
    return badges[estado] || 'bg-secondary';
  }

  eliminarPartido(partido: PartidoListado): void {
    Swal.fire({
      title: '¿Eliminar partido?',
      text: `${partido.equipo_local_nombre} vs ${partido.equipo_visitante_nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.partidoService.eliminarPartido(partido.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              timer: 1500,
              showConfirmButton: false,
            });
            this.cargarPartidos();
          },
        });
      }
    });
  }
}
