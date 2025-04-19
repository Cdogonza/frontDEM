import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NovedadesComponent } from './components/novedades/novedades.component';
import { NovedadFormComponent } from './novedad-form/novedad-form.component';
import { TallerComponent } from './components/taller/taller.component';
import { LoginComponent } from './components/login/login.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { AuthGuard } from './auth.guard';
import { ForTallerComponent } from './components/for-taller/for-taller.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { FacturacionFormComponent } from './components/facturacion-form/facturacion-form.component';
import { UsermanagementComponent } from './components/usermanagement/usermanagement.component';
import { NewpasswordComponent } from './components/newpassword/newpassword.component';

import { adminguardGuard } from './adminguard.guard';
export const routes: Routes = [
    {path: 'equipos', component: HomeComponent, canActivate: [AuthGuard]},
    {path: 'novedades', component: NovedadesComponent, canActivate: [AuthGuard]},
    {path: 'novedadForm', component: NovedadFormComponent},
    {path: 'for-taller', component: ForTallerComponent, canActivate: [AuthGuard]},
    {path: 'taller', component: TallerComponent, canActivate: [AuthGuard]},
    {path: 'login', component: LoginComponent},
    {path: 'reset-password', component: ResetpasswordComponent},
    {path: 'new-password/:token', component: NewpasswordComponent},
    {path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]},
    {path: 'formulario', component: FacturacionFormComponent, canActivate: [AuthGuard]},
    {path: 'reporte', component: ReporteComponent, canActivate: [AuthGuard]},
    {path: 'facturacion', component: FacturacionComponent, canActivate: [AuthGuard]},
    {
        path: 'unauthorized',
        loadComponent: () => import('../app/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
      },
    {
        path: 'usermanagement',
        loadComponent: () => import('./components/usermanagement/usermanagement.component').then(m => m.UsermanagementComponent),
        canActivate: [adminguardGuard],
        data: {
          allowedUsernames: ['gpaz']
        }
      },
    {
        path: 'cajamanager',
        loadComponent: () => import('./components/cajamanager/cajamanager.component').then(m => m.CajamanagerComponent),
        canActivate: [adminguardGuard],
        data: {
          allowedUsernames: ['gpaz','maolivera','mpediferro']
        }
      },
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];
