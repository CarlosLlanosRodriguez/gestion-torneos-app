import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TorneoListado } from '../../../torneos/models/torneo.model';
import { EquipoListado } from '../../../equipos/models/equipo.model';
import { ESTADOS_PARTIDO, Partido } from '../../models/partido.model';
import { PartidoService } from '../../services/partido.service';
import { TorneoService } from '../../../torneos/services/torneo.service';
import { EquipoService } from '../../../equipos/services/equipo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-partido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-partido.component.html',
  styleUrl: './formulario-partido.component.css',
})
export class FormularioPartidoComponent implements OnInit {
  partidoForm!: FormGroup;
  loading = false;
  loadingEquipos = false;
  isEditMode = false;
  partidoId: number | null = null;
  torneos: TorneoListado[] = [];
  equipos: EquipoListado[] = [];
  equiposFiltrados: EquipoListado[] = [];
  estados = ESTADOS_PARTIDO;

  constructor(
    private fb: FormBuilder,
    private partidoService: PartidoService,
    private torneoService: TorneoService,
    private equipoService: EquipoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarTorneos();
    this.cargarEquipos();
    this.checkEditMode();
  }

  private initForm(): void {
    this.partidoForm = this.fb.group({
      torneo_id: [null, [Validators.required]],
      equipo_local_id: [null, [Validators.required]],
      equipo_visitante_id: [null, [Validators.required]],
      fecha: ['', [Validators.required]],
      lugar: ['', [Validators.required]],
      estado: ['pendiente', [Validators.required]],
      marcador_local: [0, [Validators.min(0)]],
      marcador_visitante: [0, [Validators.min(0)]],
      observaciones: [''],
    });

    // Listener para cuando cambia el torneo
    this.partidoForm.get('torneo_id')?.valueChanges.subscribe((torneoId) => {
      console.log('Torneo seleccionado:', torneoId);
      if (torneoId) {
        this.filtrarEquiposPorTorneo(torneoId);
        // Limpiar selección de equipos al cambiar torneo
        this.partidoForm.patchValue({
          equipo_local_id: null,
          equipo_visitante_id: null,
        });
      } else {
        this.equiposFiltrados = [];
      }
    });
  }

  private filtrarEquiposPorTorneo(torneoId: number): void {
    console.log('Filtrando equipos para torneo:', torneoId);
    console.log('Total equipos disponibles:', this.equipos.length);

    this.equiposFiltrados = this.equipos.filter(
      (e) => {    
        return e.torneo_id === Number(torneoId);
      }
    );

    console.log('Equipos filtrados:', this.equiposFiltrados.length);
    console.log('Equipos:', this.equiposFiltrados);
  }

  private cargarTorneos(): void {
    this.torneoService.getTorneos().subscribe({
      next: (response) => {
        this.torneos = response.torneos;
        console.log('Torneos cargados:', this.torneos.length);
      },
      error: (error) => {
        console.error('Error al cargar torneos:', error);
      },
    });
  }

  private cargarEquipos(): void {
    this.loadingEquipos = true;
    this.equipoService.getEquipos().subscribe({
      next: (response) => {
        this.equipos = response.equipos;
        console.log('Equipos cargados:', this.equipos.length);
        this.loadingEquipos = false;

        // Si estamos en modo edición y ya tenemos un torneo seleccionado, filtrar
        const torneoId = this.partidoForm.get('torneo_id')?.value;
        if (torneoId) {
          this.filtrarEquiposPorTorneo(torneoId);
        }
      },
      error: (error) => {
        console.error('Error al cargar equipos:', error);
        this.loadingEquipos = false;
      },
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.partidoId = +id;
      this.cargarPartido(this.partidoId);
    }
  }

  private cargarPartido(id: number): void {
    this.loading = true;
    this.partidoService.getPartidoPorId(id).subscribe({
      next: (partido: Partido) => {
        console.log('Partido cargado:', partido);

        // Esperar a que los equipos estén cargados antes de filtrar
        const checkEquipos = setInterval(() => {
          if (this.equipos.length > 0) {
            clearInterval(checkEquipos);
            this.filtrarEquiposPorTorneo(partido.torneo_id);

            this.partidoForm.patchValue({
              torneo_id: partido.torneo_id,
              equipo_local_id: partido.equipo_local_id,
              equipo_visitante_id: partido.equipo_visitante_id,
              fecha: this.formatDateTimeForInput(partido.fecha),
              lugar: partido.lugar,
              estado: partido.estado,
              marcador_local: partido.marcador_local,
              marcador_visitante: partido.marcador_visitante,
              observaciones: partido.observaciones,
            });

            this.loading = false;
          }
        }, 100);

        // Timeout de seguridad
        setTimeout(() => {
          clearInterval(checkEquipos);
          if (this.loading) {
            this.loading = false;
          }
        }, 5000);
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/dashboard/partidos']);
      },
    });
  }

  private formatDateTimeForInput(isoDate: string): string {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onSubmit(): void {
    if (this.partidoForm.invalid) {
      Object.keys(this.partidoForm.controls).forEach((key) => {
        this.partidoForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Validación adicional: equipos diferentes
    const localId = this.partidoForm.get('equipo_local_id')?.value;
    const visitanteId = this.partidoForm.get('equipo_visitante_id')?.value;

    if (localId === visitanteId) {
      Swal.fire({
        icon: 'warning',
        title: 'Equipos iguales',
        text: 'El equipo local y visitante deben ser diferentes',
        confirmButtonColor: '#ffc107',
      });
      return;
    }

    this.loading = true;
    const formData = this.partidoForm.value;

    const request = this.isEditMode
      ? this.partidoService.actualizarPartido(this.partidoId!, formData)
      : this.partidoService.crearPartido(formData);

    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: `Partido ${
            this.isEditMode ? 'actualizado' : 'creado'
          } exitosamente`,
          timer: 1500,
          showConfirmButton: false,
        });
        this.router.navigate(['/dashboard/partidos']);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.partidoForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.partidoForm.get(field);
    if (control?.hasError('required')) return 'Este campo es requerido';
    if (control?.hasError('min')) return 'Mínimo 0';
    return '';
  }

  get f() {
    return this.partidoForm.controls;
  }
}
