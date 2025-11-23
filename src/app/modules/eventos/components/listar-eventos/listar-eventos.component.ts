import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventoListado, TIPOS_EVENTO } from '../../models/evento.model';
import { EventoService } from '../../services/evento.service';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listar-eventos.component.html',
  styleUrl: './listar-eventos.component.css'
})
export class ListarEventosComponent {
  eventos: EventoListado[] = [];
  loading = true;
  total = 0;
  tiposEvento = TIPOS_EVENTO;

  constructor(
    private eventoService: EventoService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

  // Carga todos los eventos  
  cargarEventos(): void {
    this.loading = true;
    this.eventoService.getEventos().subscribe({
      next: (response) => {
        this.eventos = response.eventos;
        this.total = response.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // Obtiene el HTML del icono y label del tipo de evento  
  getTipoIcon(tipo: string): string {
    const tipoEncontrado = this.tiposEvento.find(t => t.value === tipo);
    return tipoEncontrado 
      ? `<span style="color: ${tipoEncontrado.color}">${tipoEncontrado.icon} ${tipoEncontrado.label}</span>`
      : tipo;
  }

  
  // Formatea fecha
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Elimina un evento con confirmación
  eliminarEvento(evento: EventoListado): void {
    Swal.fire({
      title: '¿Eliminar evento?',
      text: `${evento.jugador_nombre} - ${evento.tipo} (${evento.minuto}')`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventoService.eliminarEvento(evento.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'Evento eliminado exitosamente',
              timer: 1500,
              showConfirmButton: false
            });
            this.cargarEventos();
          }
        });
      }
    });
  }
}
