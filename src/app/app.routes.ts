import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConquistadoresComponent } from './pages/conquistadores/conquistadores.component';
import { CartillasComponent } from './pages/cartillas/cartillas.component';
import { EspecialidadesComponent } from './pages/especialidades/especialidades.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'conquistadores', component: ConquistadoresComponent },
  { path: 'cartillas', component: CartillasComponent },
  { path: 'especialidades', component: EspecialidadesComponent },
  { path: '**', redirectTo: '' }
];
