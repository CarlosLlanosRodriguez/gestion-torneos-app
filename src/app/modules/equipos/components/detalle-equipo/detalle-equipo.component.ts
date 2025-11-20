import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Equipo } from '../../models/equipo.model';
import { EquipoService } from '../../services/equipo.service';

@Component({
  selector: 'app-detalle-equipo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-equipo.component.html',
  styleUrl: './detalle-equipo.component.css',
})
export class DetalleEquipoComponent implements OnInit {
  equipo: Equipo | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private equipoService: EquipoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarEquipo(+id);
    }
  }

  cargarEquipo(id: number): void {
    this.equipoService.getEquipoPorId(id).subscribe({
      next: (equipo) => {
        this.equipo = equipo;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
