import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListarUsuariosComponent } from './usuarios/components/listar-usuarios/listar-usuarios.component';
import { FormularioUsuariosComponent } from './usuarios/components/formulario-usuarios/formulario-usuarios.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path:'usuarios',
        children: [
          {
            path: '',
            component: ListarUsuariosComponent
          },
          {
            path: 'nuevo',
            component: FormularioUsuariosComponent
          },
          {
            path: 'editar/:id',
            component: FormularioUsuariosComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
