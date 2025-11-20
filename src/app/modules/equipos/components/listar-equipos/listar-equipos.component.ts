import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EquipoListado } from '../../models/equipo.model';
import { EquipoService } from '../../services/equipo.service';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-equipos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listar-equipos.component.html',
  styleUrl: './listar-equipos.component.css',
})
export class ListarEquiposComponent implements OnInit {
  equipos: EquipoListado[] = [];
  loading = true;
  total = 0;

  constructor(
    private equipoService: EquipoService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarEquipos();
  }

  cargarEquipos(): void {
    this.loading = true;
    this.equipoService.getEquipos().subscribe({
      next: (response) => {
        this.equipos = response.equipos;
        this.total = response.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  eliminarEquipo(equipo: EquipoListado): void {
    Swal.fire({
      title: '¿Eliminar equipo?',
      text: `Se eliminará el equipo "${equipo.nombre}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.equipoService.eliminarEquipo(equipo.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'Equipo eliminado exitosamente',
              timer: 1500,
              showConfirmButton: false,
            });
            this.cargarEquipos();
          },
        });
      }
    });
  }
}
