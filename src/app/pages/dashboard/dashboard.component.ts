import { Component, inject, OnInit, signal } from '@angular/core';
import { ExportacionService, ConquistadorInvestidura } from '../../services/exportacion.service';
import { ConquistadoresService, Conquistador } from '../../services/conquistadores.service';
import { ActividadService, Actividad } from '../../services/actividad.service';
import { AuthService, PerfilUsuario } from '../../services/auth.service';
import { combineLatest } from 'rxjs';

const CLASES = ['Amigo', 'Compañero', 'Explorador', 'Orientador', 'Viajero', 'Guía'];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private exportacionService = inject(ExportacionService);
  private conquistadoresService = inject(ConquistadoresService);
  private actividadService = inject(ActividadService);
  private authService = inject(AuthService);

  conquistadores: Conquistador[] = [];
  actividadReciente: Actividad[] = [];
  perfil: PerfilUsuario | null = null;
  cargando = signal(true);

  readonly clases = CLASES;

  ngOnInit() {
    combineLatest([
      this.authService.perfil$,
      this.conquistadoresService.getAll(),
      this.actividadService.getRecientes(20)
    ]).subscribe(([perfil, todosLosConquistadores, actividad]) => {
      this.perfil = perfil ?? null;
      this.conquistadores = this.esAdmin
        ? todosLosConquistadores
        : todosLosConquistadores.filter(c => c.consejero_uid === perfil?.uid);

      this.actividadReciente = this.esAdmin
        ? actividad.slice(0, 8)
        : actividad.filter(a => this.conquistadores.some(c => c.id === a.conquistador_id)).slice(0, 8);

      this.cargando.set(false);
    });
  }

  get esAdmin(): boolean {
    return this.perfil?.rol === 'Administrador';
  }

  get totalConquistadores(): number {
    return this.conquistadores.length;
  }

  get elegiblesCount(): number {
    return this.conquistadores.filter(c => c.estado_investidura === 'Elegible').length;
  }

  get riesgoCount(): number {
    return this.conquistadores.filter(c => c.estado_investidura === 'Riesgo').length;
  }

  get especialidadesEntregadasCount(): number {
    return this.conquistadores.reduce((total, c) => {
      const entregadas = c.especialidades?.filter(e => e.estado === 'Entregada').length ?? 0;
      return total + entregadas;
    }, 0);
  }

  get excelenciaAvanzadaCount(): number {
    return this.conquistadores.filter(c => {
      const paginasAvanzadas = c.cartilla?.avanzada?.flatMap(sec => sec.paginas) || [];
      if (paginasAvanzadas.length === 0) return false;
      return paginasAvanzadas.every(p => p.estado === 'Terminada');
    }).length;
  }

  // % de conquistadores de esa clase que ya están Elegibles o Investidos.
  porcentajePorClase(clase: string): number {
    const deLaClase = this.conquistadores.filter(c => c.clase_nombre === clase);
    if (deLaClase.length === 0) return 0;
    const avanzados = deLaClase.filter(c => c.estado_investidura === 'Elegible' || c.estado_investidura === 'Investido').length;
    return Math.round((avanzados / deLaClase.length) * 100);
  }

  totalPorClase(clase: string): number {
    return this.conquistadores.filter(c => c.clase_nombre === clase).length;
  }

  iniciales(nombre: string): string {
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(p => p[0]?.toUpperCase())
      .join('');
  }

  descripcionActividad(a: Actividad): string {
    switch (a.tipo) {
      case 'pagina_completada': return `completó ${a.detalle}`;
      case 'especialidad_entregada': return `entregó la especialidad "${a.detalle}"`;
      case 'investidura': return a.detalle;
    }
  }

  tiempoRelativo(fechaIso: string): string {
    const diffMs = Date.now() - new Date(fechaIso).getTime();
    const minutos = Math.floor(diffMs / 60000);
    if (minutos < 1) return 'Ahora mismo';
    if (minutos < 60) return `Hace ${minutos} min`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `Hace ${horas} h`;
    const dias = Math.floor(horas / 24);
    return `Hace ${dias} día${dias === 1 ? '' : 's'}`;
  }

  generarExcel() {
    const datosExportacion: ConquistadorInvestidura[] = this.conquistadores
      .filter(c => c.estado_investidura === 'Elegible' || c.estado_investidura === 'Investido')
      .map(c => {
        const paginasRegular = c.cartilla?.regular?.flatMap(s => s.paginas) || [];
        const paginasAvanzadas = c.cartilla?.avanzada?.flatMap(s => s.paginas) || [];
        return {
          nombre: c.nombre,
          clase: c.clase_nombre,
          invisteRegular: paginasRegular.length > 0 && paginasRegular.every(p => p.estado === 'Terminada'),
          invisteAvanzada: paginasAvanzadas.length > 0 && paginasAvanzadas.every(p => p.estado === 'Terminada'),
          especialidades: c.especialidades?.map(e => e.especialidad_id) || []
        };
      });

    this.exportacionService.exportarPedidoInvestidura(datosExportacion);
  }
}
