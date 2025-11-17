import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioLogin } from '../../core/models/usuario.model';
import { StorageService } from '../../core/services/storage.service';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  usuario: UsuarioLogin | null = null;
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    // Obtener usuario actual
    this.usuario = this.storageService.getItem(environment.userKey);
    this.isAuthenticated = !!this.usuario;
  }

  // Cierra la sesión
  logout(): void {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro que deseas salir?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
      }
    });
  }

  // Verifica si el usuario tiene un rol específico
  hasRole(roles: string[]): boolean {
    return this.authService.hasRole(roles);
  }
}
