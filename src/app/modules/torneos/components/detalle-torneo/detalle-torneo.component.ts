import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Torneo } from '../../models/torneo.model';
import { TorneoService } from '../../services/torneo.service';

@Component({
  selector: 'app-detalle-torneo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-torneo.component.html',
  styleUrl: './detalle-torneo.component.css',
})
export class DetalleTorneoComponent implements OnInit {
  torneo: Torneo | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private torneoService: TorneoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarTorneo(+id);
    }
  }

  cargarTorneo(id: number): void {
    this.torneoService.getTorneoPorId(id).subscribe({
      next: (torneo) => {
        this.torneo = torneo;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getEstadoBadgeClass(estado: string): string {
    const badges: { [key: string]: string } = {
      planificado: 'bg-info',
      en_curso: 'bg-success',
      finalizado: 'bg-secondary',
      cancelado: 'bg-danger',
    };
    return badges[estado] || 'bg-secondary';
  }
}
