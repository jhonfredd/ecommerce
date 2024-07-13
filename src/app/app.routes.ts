import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { RegistrarProductosComponent } from './pages/registrar-productos/registrar-productos.component';
import { CambiarContrasenaComponent } from './pages/cambiar-contrasena/cambiar-contrasena.component';

export const routes: Routes = [
    { path: '', component: LayoutComponent,
        children: [
            {path : '', redirectTo:"dashboard", pathMatch:"full" },
            {path : 'login',
                canActivate:[guestGuard],
                component: LoginComponent
            },
            {path : 'register',
                canActivate:[guestGuard],
                component: RegisterComponent
            },
            {path : 'dashboard',
                // canActivate:[authGuard], //se usan los guard para redirecionar
                component: DashboardComponent
            },
            {path : 'registarProductos',
                canActivate:[authGuard],
                component: RegistrarProductosComponent
            },
            {path : 'cambioPassword',
                canActivate:[authGuard],
                component: CambiarContrasenaComponent
            },

        ]
    },
];
