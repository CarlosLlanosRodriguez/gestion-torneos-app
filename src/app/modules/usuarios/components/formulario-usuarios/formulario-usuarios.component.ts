import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { UsuarioListado } from '../../models/usuario-listado.model';

@Component({
  selector: 'app-formulario-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './formulario-usuarios.component.html',
  styleUrl: './formulario-usuarios.component.css',
})
export class FormularioUsuariosComponent implements OnInit {
  usuarioForm!: FormGroup;
  passwordForm!: FormGroup;
  loading = false;
  isEditMode = false;
  usuarioId: number | null = null;

  // Lista de roles disponibles
  roles = [
    { id: 1, nombre: 'admin', descripcion: 'Administrador con acceso total' },
    { id: 2, nombre: 'organizador', descripcion: 'Puede crear y gestionar torneos' },
    { id: 3, nombre: 'delegado', descripcion: 'Puede gestionar equipos y jugadores' },
    { id: 4, nombre: 'participante', descripcion: 'Solo lectura' }
  ];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initPasswordForm();
    this.checkEditMode();
  }

  // Inicializa el formulario principal
  private initForm(): void {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol_id: [null, Validators.required],
      telefono: [
        '',
        [Validators.required, Validators.pattern(/^\d{3}-\d{4}$/)],
      ],
      activo: [true],
    });
  }

  // Inicializa el formulario de cambio de contraseña
  private initPasswordForm(): void {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Verifica si es modo edición y carga los datos
  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('id', id);    

    if (id) {
      this.isEditMode = true;
      this.usuarioId = +id;
      this.cargarUsuario(this.usuarioId);

      // En modo edición, el password no es requerido
      this.usuarioForm.get('password')?.clearValidators();
      this.usuarioForm.get('password')?.updateValueAndValidity();
    }
  }

  // Carga los datos del usuario a editar
  private cargarUsuario(id: number): void {
    this.loading = true;

    this.usuarioService.getUsuarioPorId(id).subscribe({
      next: (usuario: UsuarioListado) => {
        this.usuarioForm.patchValue({
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          rol_id: usuario.rol_id,
          telefono: usuario.telefono,
          activo: usuario.activo,
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/dashboard/usuarios']);
      },
    });
  }

  // Envía el formulario (crear o actualizar)
  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      Object.keys(this.usuarioForm.controls).forEach((key) => {
        this.usuarioForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const formData = this.usuarioForm.value;

    // Si es edición y no se ingresó password, removerlo
    if (this.isEditMode && !formData.password) {
      delete formData.password;
    }

    const request = this.isEditMode
      ? this.usuarioService.actualizarUsuario(this.usuarioId!, formData)
      : this.usuarioService.crearUsuario(formData);

    request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: `Usuario ${
            this.isEditMode ? 'actualizado' : 'creado'
          } exitosamente`,
          timer: 1500,
          showConfirmButton: false,
        });
        this.router.navigate(['/dashboard/usuarios']);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  // Cambia la contraseña del usuario
  onCambiarPassword(): void {
    if (this.passwordForm.invalid || !this.usuarioId) {
      this.passwordForm.get('password')?.markAsTouched();
      return;
    }

    Swal.fire({
      title: '¿Cambiar contraseña?',
      text: 'Se actualizará la contraseña del usuario',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        const data = this.passwordForm.value;

        this.usuarioService.cambiarPassword(this.usuarioId!, data).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Contraseña actualizada',
              text: 'La contraseña se ha cambiado exitosamente',
              timer: 1500,
              showConfirmButton: false,
            });
            this.passwordForm.reset();
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          },
        });
      }
    });
  }

  // Verifica si un campo es inválido
  isFieldInvalid(field: string, form: FormGroup = this.usuarioForm): boolean {
    const control = form.get(field);
    return !!(control && control.invalid && control.touched);
  }

  // Obtiene el mensaje de error de un campo
  getErrorMessage(field: string, form: FormGroup = this.usuarioForm): string {
    const control = form.get(field);

    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email')) {
      return 'Ingrese un email válido';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
      if (field === 'telefono') {
        return 'Formato: 555-1234';
      }
    }

    return '';
  }

}
