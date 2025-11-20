import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListarUsuariosComponent } from './usuarios/components/listar-usuarios/listar-usuarios.component';
import { FormularioUsuariosComponent } from './usuarios/components/formulario-usuarios/formulario-usuarios.component';
import { authGuard } from '../core/guards/auth.guard';
import { roleGuard } from '../core/guards/role.guard';
import { ListarTorneosComponent } from './torneos/components/listar-torneos/listar-torneos.component';
import { FormularioTorneoComponent } from './torneos/components/formulario-torneo/formulario-torneo.component';
import { DetalleTorneoComponent } from './torneos/components/detalle-torneo/detalle-torneo.component';
import { ListarEquiposComponent } from './equipos/components/listar-equipos/listar-equipos.component';
import { FormularioEquipoComponent } from './equipos/components/formulario-equipo/formulario-equipo.component';
import { DetalleEquipoComponent } from './equipos/components/detalle-equipo/detalle-equipo.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'usuarios',
        children: [
          {
            path: '',
            component: ListarUsuariosComponent,
            canActivate: [authGuard, roleGuard],
            data: { roles: ['admin'] },
            title: 'Gestión de Usuarios',
          },
          {
            path: 'nuevo',
            component: FormularioUsuariosComponent,
            canActivate: [authGuard, roleGuard],
            data: { roles: ['admin'] },
            title: 'Nuevo Usuario',
          },
          {
            path: 'editar/:id',
            component: FormularioUsuariosComponent,
            canActivate: [authGuard, roleGuard],
            data: { roles: ['admin'] },
            title: 'Editar Usuario',
          },
        ],
      },
      {
        path: 'torneos',
        children: [
          {
            path: '',
            component: ListarTorneosComponent,
            canActivate: [authGuard],
            title: 'Gestión de Torneos',
          },
          {
            path: 'nuevo',
            component: FormularioTorneoComponent,
            canActivate: [authGuard],
            title: 'Nuevo Torneo',
          },
          {
            path: 'editar/:id',
            component: FormularioTorneoComponent,
            canActivate: [authGuard],
            title: 'Editar Torneo',
          },
          {
            path: ':id',
            component: DetalleTorneoComponent,
            canActivate: [authGuard],
            title: 'Detalle del Torneo',
          },
        ],
      },
      {
        path: 'equipos',
        children: [
          {
            path: '',
            component: ListarEquiposComponent,
            canActivate: [authGuard],
            title: 'Gestión de Equipos',
          },
          {
            path: 'nuevo',
            component: FormularioEquipoComponent,
            canActivate: [authGuard],
            title: 'Nuevo Equipo',
          },
          {
            path: 'editar/:id',
            component: FormularioEquipoComponent,
            canActivate: [authGuard],
            title: 'Editar Equipo',
          },
          {
            path: ':id',
            component: DetalleEquipoComponent,
            canActivate: [authGuard],
            title: 'Detalle de Equipo',
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
