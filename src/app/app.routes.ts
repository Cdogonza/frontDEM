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
export const routes: Routes = [
    {path: 'equipos', component: HomeComponent, canActivate: [AuthGuard]},
    {path: 'novedades', component: NovedadesComponent, canActivate: [AuthGuard]},
    {path: 'novedadForm', component: NovedadFormComponent},
    {path: 'for-taller', component: ForTallerComponent, canActivate: [AuthGuard]},
    {path: 'taller', component: TallerComponent, canActivate: [AuthGuard]},
    {path: 'login', component: LoginComponent},
    {path: 'reset-password', component: ResetpasswordComponent},
    {path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]},
    {path: 'facturacion', component: FacturacionComponent, canActivate: [AuthGuard]},
    {path: '', redirectTo: '/login', pathMatch: 'full'}
];
