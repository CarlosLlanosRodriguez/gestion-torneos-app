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
import { ListarJugadoresComponent } from './jugadores/components/listar-jugadores/listar-jugadores.component';
import { FormularioJugadorComponent } from './jugadores/components/formulario-jugador/formulario-jugador.component';
import { DetalleJugadorComponent } from './jugadores/components/detalle-jugador/detalle-jugador.component';
import { ListarPartidosComponent } from './partidos/components/listar-partidos/listar-partidos.component';
import { FormularioPartidoComponent } from './partidos/components/formulario-partido/formulario-partido.component';
import { DetallePartidoComponent } from './partidos/components/detalle-partido/detalle-partido.component';

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
      {
        path: 'jugadores',
        children: [
          {
            path: '',
            component: ListarJugadoresComponent,
            canActivate: [authGuard],
            title: 'Gestión de Jugadores',
          },
          {
            path: 'nuevo',
            component: FormularioJugadorComponent,
            canActivate: [authGuard],
            title: 'Nuevo Jugador',
          },
          {
            path: 'editar/:id',
            component: FormularioJugadorComponent,
            canActivate: [authGuard],
            title: 'Editar Jugador',
          },
          {
            path: ':id',
            component: DetalleJugadorComponent,
            canActivate: [authGuard],
            title: 'Detalle del Jugador',
          },
        ],
      },
      {
        path: 'partidos',
        children: [
          {
            path: '',
            component: ListarPartidosComponent,
            canActivate: [authGuard],
            title: 'Gestión de Partidos',
          },
          {
            path: 'nuevo',
            component: FormularioPartidoComponent,
            canActivate: [authGuard],
            title: 'Nuevo Partido',
          },
          {
            path: 'editar/:id',
            component: FormularioPartidoComponent,
            canActivate: [authGuard],
            title: 'Editar Partido',
          },
          {
            path: ':id',
            component: DetallePartidoComponent,
            canActivate: [authGuard],
            title: 'Detalle del Partido',
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
