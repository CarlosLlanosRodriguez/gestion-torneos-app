import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TorneoListado } from '../../../torneos/models/torneo.model';
import { EquipoService } from '../../services/equipo.service';
import { TorneoService } from '../../../torneos/services/torneo.service';
import { Equipo } from '../../models/equipo.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-equipo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-equipo.component.html',
  styleUrl: './formulario-equipo.component.css',
})
export class FormularioEquipoComponent implements OnInit {
  equipoForm!: FormGroup;
  loading = false;
  isEditMode = false;
  equipoId: number | null = null;
  torneos: TorneoListado[] = [];

  constructor(
    private fb: FormBuilder,
    private equipoService: EquipoService,
    private torneoService: TorneoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarTorneos();
    this.checkEditMode();
  }

  private initForm(): void {
    this.equipoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      color: ['', [Validators.required]],
      representante: ['', [Validators.required]],
      telefono_representante: [
        '',
        [Validators.required, Validators.pattern(/^\d{3}-\d{4}$/)],
      ],
      torneo_id: [null, [Validators.required]],
    });
  }

  private cargarTorneos(): void {
    this.torneoService.getTorneos().subscribe({
      next: (response) => {
        this.torneos = response.torneos;
      },
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.equipoId = +id;
      this.cargarEquipo(this.equipoId);
    }
  }

  private cargarEquipo(id: number): void {
    this.loading = true;
    this.equipoService.getEquipoPorId(id).subscribe({
      next: (equipo: Equipo) => {
        this.equipoForm.patchValue({
          nombre: equipo.nombre,
          color: equipo.color,
          representante: equipo.representante,
          telefono_representante: equipo.telefono_representante,
          torneo_id: equipo.torneo_id,
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/dashboard/equipos']);
      },
    });
  }

  onSubmit(): void {
    if (this.equipoForm.invalid) {
      Object.keys(this.equipoForm.controls).forEach((key) => {
        this.equipoForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const formData = this.equipoForm.value;

    const request = this.isEditMode
      ? this.equipoService.actualizarEquipo(this.equipoId!, formData)
      : this.equipoService.crearEquipo(formData);

    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: `Equipo ${
            this.isEditMode ? 'actualizado' : 'creado'
          } exitosamente`,
          timer: 1500,
          showConfirmButton: false,
        });
        this.router.navigate(['/dashboard/equipos']);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.equipoForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.equipoForm.get(field);
    if (control?.hasError('required')) return 'Este campo es requerido';
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
      if (field === 'telefono_representante') return 'Formato: 555-1234';
    }
    return '';
  }
}
