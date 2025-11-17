import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // Ruta por defecto - redirige al login
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full',
    },

    // Módulo de Autenticación (Lazy Loading)
    {
        path: 'auth',
        loadChildren: () =>
            import('./modules/auth/auth-routing.module').then(
                (m) => m.AuthRoutingModule
            ),
    },

    // Módulos de gestión
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadChildren: () =>
            import('./modules/modules-routing.module').then(
                (m) => m.ModulesRoutingModule
            ),
    },
];
