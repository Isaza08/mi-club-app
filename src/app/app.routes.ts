import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConquistadoresComponent } from './pages/conquistadores/conquistadores.component';
import { CartillasComponent } from './pages/cartillas/cartillas.component';
import { EspecialidadesComponent } from './pages/especialidades/especialidades.component';
import { LoginComponent } from './pages/login/login.component';
import { MisConquistadoresComponent } from './pages/mis-conquistadores/mis-conquistadores.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'conquistadores', component: ConquistadoresComponent, canActivate: [authGuard, adminGuard] },
  { path: 'mis-conquistadores', component: MisConquistadoresComponent, canActivate: [authGuard] },
  { path: 'cartillas/:id', component: CartillasComponent, canActivate: [authGuard] },
  { path: 'cartillas', component: CartillasComponent, canActivate: [authGuard] },
  { path: 'especialidades', component: EspecialidadesComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
