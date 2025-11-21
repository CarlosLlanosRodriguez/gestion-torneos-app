import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Partido } from '../../models/partido.model';
import { PartidoService } from '../../services/partido.service';

@Component({
  selector: 'app-detalle-partido',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-partido.component.html',
  styleUrl: './detalle-partido.component.css',
})
export class DetallePartidoComponent {
  partido: Partido | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private partidoService: PartidoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarPartido(+id);
    }
  }

  cargarPartido(id: number): void {
    this.partidoService.getPartidoPorId(id).subscribe({
      next: (partido) => {
        this.partido = partido;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
}
