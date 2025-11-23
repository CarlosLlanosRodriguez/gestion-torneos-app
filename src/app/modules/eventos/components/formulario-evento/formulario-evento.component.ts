import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Partido } from '../../../partidos/models/partido.model';
import { JugadorListado } from '../../../jugadores/models/jugador.model';
import { Evento, TIPOS_EVENTO } from '../../models/evento.model';
import { EventoService } from '../../services/evento.service';
import { PartidoService } from '../../../partidos/services/partido.service';
import { JugadorService } from '../../../jugadores/services/jugador.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-evento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-evento.component.html',
  styleUrl: './formulario-evento.component.css'
})
export class FormularioEventoComponent implements OnInit {
  eventoForm!: FormGroup;
  loading = false;
  loadingData = false;
  isEditMode = false;
  eventoId: number | null = null;
  partidoId: number | null = null;
  partido: Partido | null = null;
  todosLosJugadores: JugadorListado[] = [];
  jugadoresDelPartido: JugadorListado[] = [];
  tiposEvento = TIPOS_EVENTO;

  constructor(
    private fb: FormBuilder,
    private eventoService: EventoService,
    private partidoService: PartidoService,
    private jugadorService: JugadorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkMode();
  }

  // Inicializa el formulario
  private initForm(): void {
    this.eventoForm = this.fb.group({
      partido_id: [null, [Validators.required]],
      jugador_id: [null, [Validators.required]],
      tipo: ['gol', [Validators.required]],
      minuto: [null, [Validators.required, Validators.min(1), Validators.max(120)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  // Determina si es modo creación o edición
  private checkMode(): void {
    const eventoId = this.route.snapshot.paramMap.get('id');
    const partidoId = this.route.snapshot.paramMap.get('partidoId');

    if (eventoId) {
      // Modo edición
      this.isEditMode = true;
      this.eventoId = +eventoId;
      this.cargarEvento(this.eventoId);
    } else if (partidoId) {
      // Modo creación desde un partido
      this.partidoId = +partidoId;
      this.eventoForm.patchValue({ partido_id: this.partidoId });
      this.cargarDatosParaCrear(this.partidoId);
    }
  }

  
  // Carga datos necesarios para crear un evento
  private cargarDatosParaCrear(partidoId: number): void {
    this.loadingData = true;

    // Cargar partido
    this.partidoService.getPartidoPorId(partidoId).subscribe({
      next: (partido) => {
        this.partido = partido;
        // Cargar jugadores después de tener el partido
        this.cargarJugadores();
      },
      error: () => {
        this.loadingData = false;
        this.router.navigate(['/partidos']);
      }
    });
  }

  // Carga todos los jugadores y filtra los del partido
  private cargarJugadores(): void {
    this.jugadorService.getJugadores().subscribe({
      next: (response) => {
        this.todosLosJugadores = response.jugadores;
        this.filtrarJugadoresDelPartido();
        this.loadingData = false;
      },
      error: () => {
        this.loadingData = false;
      }
    });
  }

  // Filtra solo los jugadores que participan en el partido
  private filtrarJugadoresDelPartido(): void {
    if (!this.partido) return;

    this.jugadoresDelPartido = this.todosLosJugadores.filter(j => 
      j.equipo_id === this.partido!.equipo_local_id || 
      j.equipo_id === this.partido!.equipo_visitante_id
    );

    console.log(`Jugadores del partido: ${this.jugadoresDelPartido.length}`);
  }

  // Obtiene jugadores de un equipo específico
  getJugadoresPorEquipo(equipoId: number): JugadorListado[] {
    return this.jugadoresDelPartido.filter(j => j.equipo_id === equipoId);
  }

  // Carga evento para editar
  private cargarEvento(id: number): void {
    this.loading = true;

    this.eventoService.getEventoPorId(id).subscribe({
      next: (evento: Evento) => {
        this.partidoId = evento.partido_id;
        
        // Cargar datos del partido primero
        this.partidoService.getPartidoPorId(evento.partido_id).subscribe({
          next: (partido) => {
            this.partido = partido;
            
            // Luego cargar jugadores
            this.jugadorService.getJugadores().subscribe({
              next: (response) => {
                this.todosLosJugadores = response.jugadores;
                this.filtrarJugadoresDelPartido();
                
                // Finalmente llenar el formulario
                this.eventoForm.patchValue({
                  partido_id: evento.partido_id,
                  jugador_id: evento.jugador_id,
                  tipo: evento.tipo,
                  minuto: evento.minuto,
                  descripcion: evento.descripcion
                });
                
                this.loading = false;
              },
              error: () => {
                this.loading = false;
              }
            });
          },
          error: () => {
            this.loading = false;
          }
        });
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/dashboard/eventos']);
      }
    });
  }

  // Envía el formulario
  onSubmit(): void {
    if (this.eventoForm.invalid) {
      Object.keys(this.eventoForm.controls).forEach(key => {
        this.eventoForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const formData = this.eventoForm.value;

    const request = this.isEditMode
      ? this.eventoService.actualizarEvento(this.eventoId!, formData)
      : this.eventoService.crearEvento(formData);

    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: `Evento ${this.isEditMode ? 'actualizado' : 'registrado'} exitosamente`,
          timer: 1500,
          showConfirmButton: false
        });
        
        // Redirigir al detalle del partido
        if (this.partidoId) {
          this.router.navigate(['/dashboard/partidos', this.partidoId]);
        } else {
          this.router.navigate(['/dashboard/eventos']);
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // Verifica si un campo es inválido
  isFieldInvalid(field: string): boolean {
    const control = this.eventoForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  // Obtiene mensaje de error
  getErrorMessage(field: string): string {
    const control = this.eventoForm.get(field);
    if (control?.hasError('required')) return 'Este campo es requerido';
    if (control?.hasError('min')) return 'Mínimo 1';
    if (control?.hasError('max')) return 'Máximo 120 minutos';
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    return '';
  }

  // Obtiene el icono del tipo de evento
  getTipoIcon(tipo: string): string {
    const tipoEncontrado = this.tiposEvento.find(t => t.value === tipo);
    return tipoEncontrado?.icon || '';
  }
}
