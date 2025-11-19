import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ESTADOS_TORNEO, Torneo } from '../../models/torneo.model';
import { TorneoService } from '../../services/torneo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-torneo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-torneo.component.html',
  styleUrl: './formulario-torneo.component.css',
})
export class FormularioTorneoComponent implements OnInit {
  torneoForm!: FormGroup;
  loading = false;
  isEditMode = false;
  torneoId: number | null = null;
  estados = ESTADOS_TORNEO;

  constructor(
    private fb: FormBuilder,
    private torneoService: TorneoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  // Inicializa el formulario
  
  private initForm(): void {
    this.torneoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      disciplina: ['', [Validators.required]],
      temporada: ['', [Validators.required]],
      fecha_inicio: ['', [Validators.required]],
      fecha_fin: ['', [Validators.required]],
      estado: ['planificado', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  // Verifica si es modo edición
  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.torneoId = +id;
      this.cargarTorneo(this.torneoId);
    }
  }

  // Carga los datos del torneo a editar
  private cargarTorneo(id: number): void {
    this.loading = true;

    this.torneoService.getTorneoPorId(id).subscribe({
      next: (torneo: Torneo) => {
        this.torneoForm.patchValue({
          nombre: torneo.nombre,
          disciplina: torneo.disciplina,
          temporada: torneo.temporada,
          fecha_inicio: this.formatDateForInput(torneo.fecha_inicio),
          fecha_fin: this.formatDateForInput(torneo.fecha_fin),
          estado: torneo.estado,
          descripcion: torneo.descripcion,
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/dashboard/torneos']);
      },
    });
  }

  // Convierte fecha ISO a formato input date
  private formatDateForInput(isoDate: string): string {
    return isoDate.split('T')[0];
  }

  // Envía el formulario
  onSubmit(): void {
    if (this.torneoForm.invalid) {
      Object.keys(this.torneoForm.controls).forEach((key) => {
        this.torneoForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const formData = this.torneoForm.value;

    const request = this.isEditMode
      ? this.torneoService.actualizarTorneo(this.torneoId!, formData)
      : this.torneoService.crearTorneo(formData);

    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: `Torneo ${
            this.isEditMode ? 'actualizado' : 'creado'
          } exitosamente`,
          timer: 1500,
          showConfirmButton: false,
        });
        this.router.navigate(['/dashboard/torneos']);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  // Verifica si un campo es inválido
  isFieldInvalid(field: string): boolean {
    const control = this.torneoForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  // Obtiene mensaje de error
  getErrorMessage(field: string): string {
    const control = this.torneoForm.get(field);

    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }

    return '';
  }
}
