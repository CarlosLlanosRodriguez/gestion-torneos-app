import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  // Formulario reactivo
  loginForm!: FormGroup;
  
  // Estado de carga
  loading = false;
  
  // URL de retorno después del login (si viene de un redirect)
  returnUrl: string = '/';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Si ya está autenticado, redirigir
    if (this.authService.isAuthenticated()) {
      //this.authService.redirectByRole();
      this.router.navigate(['/dashboard']);
      return;
    }

    // Inicializar formulario con validaciones
    this.initForm();

    // Obtener returnUrl de los query params (si existe)
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // Inicializa el formulario con validaciones
  private initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Maneja el envío del formulario
  onSubmit(): void {
    // Marcar todos los campos como touched para mostrar errores
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Iniciar carga
    this.loading = true;

    // Obtener credenciales del formulario
    const credentials = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value,
    };

    // Llamar al servicio de login
    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Login exitoso
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: `Hola ${response.usuario.nombre}`,
          timer: 1500,
          showConfirmButton: false
        });

        // Redirigir según rol o a la URL de retorno
        if (this.returnUrl && this.returnUrl !== '/') {
          this.router.navigate([this.returnUrl]);
        } else {
          //this.authService.redirectByRole();
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        // El error ya se maneja en el ErrorInterceptor
        // Aquí solo detenemos el loading
        console.log('login component error', error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  // Verifica si un campo es inválido y ha sido tocado
  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  // Obtiene el mensaje de error de un campo
  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    
    if (control?.hasError('required')) {
      return `${this.getFieldLabel(field)} es requerido`;
    }
    
    if (control?.hasError('email')) {
      return 'Ingrese un email válido';
    }
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    
    return '';
  }

  // Obtiene la etiqueta del campo para los mensajes de error
  private getFieldLabel(field: string): string {
    const labels: { [key: string]: string } = {
      email: 'El email',
      password: 'La contraseña'
    };
    return labels[field] || field;
  }

}
