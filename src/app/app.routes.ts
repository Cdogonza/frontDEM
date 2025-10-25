import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { NovedadesComponent } from './components/novedades/novedades.component';
import { NovedadFormComponent } from './novedad-form/novedad-form.component';
import { TallerComponent } from './components/taller/taller.component';
import { LoginComponent } from './components/login/login.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { AuthGuard } from './auth.guard';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { FacturacionFormComponent } from './components/facturacion-form/facturacion-form.component';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { ComprasComponent } from './components/compras/compras.component';
import { DetallesCompraComponent } from './components/detalles-compra/detalles-compra.component';
import { InformesTecnicosComponent } from './components/informes-tecnicos/informes-tecnicos.component';
import { adminguardGuard } from './adminguard.guard';
export const routes: Routes = [
    {path: 'novedades', component: NovedadesComponent, canActivate: [AuthGuard]},
    {path: 'novedadForm', component: NovedadFormComponent},
    {path: 'documentos',component: DocumentosComponent},
    {path: 'taller', component: TallerComponent, canActivate: [AuthGuard]},
    {path: 'login', component: LoginComponent},
    {path: 'reset-password', component: ResetpasswordComponent},
    {path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]},
    {path: 'formulario', component: FacturacionFormComponent, canActivate: [AuthGuard]},
    {path: 'reporte', component: ReporteComponent, canActivate: [AuthGuard]},
    {path: 'facturacion', component: FacturacionComponent, canActivate: [AuthGuard]},
    {path: 'compras', component: ComprasComponent, canActivate: [AuthGuard]},
    {path: 'informes-tecnicos', component: InformesTecnicosComponent, canActivate: [AuthGuard]},
    {
      path: 'detalles-compra/:id',
      loadComponent: () =>
        import('./components/detalles-compra/detalles-compra.component')
          .then(m => m.DetallesCompraComponent)
    }
    ,
    {path: 'secretaria',
      loadComponent: () => import('./components/secretaria/secretaria.component').then(m => m.SecretariaComponent)},
    {
      path: 'new-password',
      loadComponent: () => import('./components/newpassword/newpassword.component').then(m => m.NewpasswordComponent),
    
    },

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
