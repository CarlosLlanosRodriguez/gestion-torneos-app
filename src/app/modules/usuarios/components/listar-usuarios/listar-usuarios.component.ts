import { Component, OnInit } from '@angular/core';
import { UsuarioListado } from '../../models/usuario-listado.model';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listar-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './listar-usuarios.component.html',
  styleUrl: './listar-usuarios.component.css',
})
export class ListarUsuariosComponent implements OnInit {
  usuarios: UsuarioListado[] = [];
  loading = true;
  total = 0;

  constructor(
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // Carga todos los usuarios
  cargarUsuarios(): void {
    this.loading = true;

    this.usuarioService.getUsuarios().subscribe({
      next: (response) => {
        this.usuarios = response.usuarios;
        this.total = response.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  // Elimina un usuario con confirmación
  eliminarUsuario(usuario: UsuarioListado): void {
    Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Se eliminará a ${usuario.nombre} ${usuario.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'Usuario eliminado exitosamente',
              timer: 1500,
              showConfirmButton: false,
            });
            this.cargarUsuarios();
          },
        });
      }
    });
  }

  // Badge de rol
  getRoleBadgeClass(rol: string): string {
    const badges: { [key: string]: string } = {
      admin: 'bg-danger',
      organizador: 'bg-primary',
      delegado: 'bg-success',
      participante: 'bg-info',
    };
    return badges[rol] || 'bg-secondary';
  }

  // Badge de estado
  getEstadoBadgeClass(activo: boolean): string {
    return activo ? 'bg-success' : 'bg-secondary';
  }
}
