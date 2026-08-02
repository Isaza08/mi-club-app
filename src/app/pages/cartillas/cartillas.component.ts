import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  ConquistadoresService,
  Conquistador,
  SeccionCartilla,
  Pagina
} from '../../services/conquistadores.service';
import { ActividadService } from '../../services/actividad.service';
import { AuthService, PerfilUsuario } from '../../services/auth.service';
import { combineLatest } from 'rxjs';

type Tipo = 'regular' | 'avanzada';

@Component({
  selector: 'app-cartillas',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './cartillas.component.html',
  styleUrl: './cartillas.component.css'
})
export class CartillasComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private conquistadoresService = inject(ConquistadoresService);
  private actividadService = inject(ActividadService);
  private authService = inject(AuthService);

  conquistador = signal<Conquistador | null>(null);
  conquistadores = signal<Conquistador[]>([]);
  cargando = signal(true);
  guardando = signal(false);
  noAutorizado = signal(false);
  perfil: PerfilUsuario | null = null;

  get esAdmin(): boolean {
    return this.perfil?.rol === 'Administrador';
  }

  tipoActivo: Tipo = 'regular';
  indiceActivo = 0;

  nuevaSeccionTitulo = '';
  nuevaPaginaNumero: number | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      combineLatest([
        this.authService.perfil$,
        this.conquistadoresService.getAll()
      ]).subscribe(([perfil, data]) => {
        this.perfil = perfil ?? null;
        const esAdmin = this.perfil?.rol === 'Administrador';
        this.conquistadores.set(esAdmin ? data : data.filter(c => c.consejero_uid === this.perfil?.uid));
        this.cargando.set(false);
      });
      return;
    }

    combineLatest([
      this.authService.perfil$,
      this.conquistadoresService.getById(id)
    ]).subscribe(([perfil, data]) => {
      this.perfil = perfil ?? null;
      const esAdmin = this.perfil?.rol === 'Administrador';
      if (!esAdmin && data.consejero_uid !== this.perfil?.uid) {
        this.noAutorizado.set(true);
        this.cargando.set(false);
        return;
      }
      this.conquistador.set(data);
      this.cargando.set(false);
    });
  }

  irACartilla(id: string) {
    this.router.navigate(['/cartillas', id]);
  }

  getPorcentajeRegular(c: Conquistador): number {
    const paginas = c.cartilla?.regular?.flatMap(s => s.paginas) || [];
    if (paginas.length === 0) return 0;
    const terminadas = paginas.filter(p => p.estado === 'Terminada').length;
    return Math.round((terminadas / paginas.length) * 100);
  }

  secciones(tipo: Tipo): SeccionCartilla[] {
    const c = this.conquistador();
    return (tipo === 'regular' ? c?.cartilla?.regular : c?.cartilla?.avanzada) ?? [];
  }

  seccionActiva(): SeccionCartilla | null {
    return this.secciones(this.tipoActivo)[this.indiceActivo] ?? null;
  }

  seleccionarSeccion(tipo: Tipo, indice: number) {
    this.tipoActivo = tipo;
    this.indiceActivo = indice;
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'Terminada':
      case 'Aprobado':
      case 'Elegible':
      case 'Investido': return 'badge-done';
      case 'En progreso':
      case 'En Progreso': return 'badge-progress';
      case 'Por hacer':
      case 'Pendiente':
      case 'Riesgo': return 'badge-pending';
      default: return 'badge-pending';
    }
  }

  porcentajeAvance(tipo: Tipo): number {
    const paginas = this.secciones(tipo).flatMap(s => s.paginas);
    if (paginas.length === 0) return 0;
    const terminadas = paginas.filter(p => p.estado === 'Terminada').length;
    return Math.round((terminadas / paginas.length) * 100);
  }

  async toggleEstado(pagina: Pagina, seccion: SeccionCartilla) {
    let quedoTerminada = false;

    if (pagina.estado === 'Por hacer') {
      pagina.estado = 'En progreso';
    } else if (pagina.estado === 'En progreso') {
      pagina.estado = 'Terminada';
      pagina.fecha_realizacion = new Date().toISOString().split('T')[0];
      quedoTerminada = true;
    } else {
      pagina.estado = 'Por hacer';
      pagina.fecha_realizacion = null;
    }

    this.actualizarEstadoSeccion(seccion);
    await this.persistirCartilla();

    const c = this.conquistador();
    if (quedoTerminada && c?.id) {
      await this.actividadService.registrar({
        tipo: 'pagina_completada',
        conquistador_id: c.id,
        conquistador_nombre: c.nombre,
        detalle: `Página ${pagina.numero_pagina} de "${seccion.titulo}"`,
        fecha: new Date().toISOString()
      });
    }
  }

  async onFechaCambiada() {
    await this.persistirCartilla();
  }

  async agregarSeccion() {
    const titulo = this.nuevaSeccionTitulo.trim();
    if (!titulo) return;

    const c = this.conquistador();
    if (!c) return;

    const nuevaSeccion: SeccionCartilla = { titulo, estado_seccion: 'Por hacer', paginas: [] };
    const cartilla = c.cartilla ?? { regular: [], avanzada: [] };
    if (this.tipoActivo === 'regular') {
      cartilla.regular = [...cartilla.regular, nuevaSeccion];
      this.indiceActivo = cartilla.regular.length - 1;
    } else {
      cartilla.avanzada = [...cartilla.avanzada, nuevaSeccion];
      this.indiceActivo = cartilla.avanzada.length - 1;
    }

    this.conquistador.set({ ...c, cartilla });
    this.nuevaSeccionTitulo = '';
    await this.persistirCartilla();
  }

  async agregarPagina() {
    const seccion = this.seccionActiva();
    if (!seccion || this.nuevaPaginaNumero === null) return;

    const nuevaPagina: Pagina = {
      numero_pagina: this.nuevaPaginaNumero,
      estado: 'Por hacer',
      fecha_realizacion: null
    };
    seccion.paginas = [...seccion.paginas, nuevaPagina];
    this.actualizarEstadoSeccion(seccion);
    this.nuevaPaginaNumero = null;
    await this.persistirCartilla();
  }

  private actualizarEstadoSeccion(seccion: SeccionCartilla) {
    const total = seccion.paginas.length;
    if (total === 0) return;

    const terminadas = seccion.paginas.filter(p => p.estado === 'Terminada').length;
    const porHacer = seccion.paginas.filter(p => p.estado === 'Por hacer').length;

    if (terminadas === total) {
      seccion.estado_seccion = 'Terminada';
    } else if (porHacer === total) {
      seccion.estado_seccion = 'Por hacer';
    } else {
      seccion.estado_seccion = 'En progreso';
    }
  }

  puedeMarcarInvestido(): boolean {
    const c = this.conquistador();
    return !!c && c.estado_investidura !== 'Investido' && this.porcentajeAvance('regular') === 100;
  }

  async marcarInvestido() {
    const c = this.conquistador();
    if (!c?.id) return;

    this.guardando.set(true);
    try {
      await this.conquistadoresService.update(c.id, { estado_investidura: 'Investido' });
      this.conquistador.set({ ...c, estado_investidura: 'Investido' });
      await this.actividadService.registrar({
        tipo: 'investidura',
        conquistador_id: c.id,
        conquistador_nombre: c.nombre,
        detalle: `Fue investido en clase ${c.clase_nombre}`,
        fecha: new Date().toISOString()
      });
    } finally {
      this.guardando.set(false);
    }
  }

  private async persistirCartilla() {
    const c = this.conquistador();
    if (!c?.id || !c.cartilla) return;

    const nuevoEstado = this.conquistadoresService.calcularEstadoInvestidura(c.cartilla, c.estado_investidura);
    if (nuevoEstado !== c.estado_investidura) {
      this.conquistador.set({ ...c, estado_investidura: nuevoEstado });
    }

    this.guardando.set(true);
    try {
      await this.conquistadoresService.update(c.id, { cartilla: c.cartilla, estado_investidura: nuevoEstado });
    } finally {
      this.guardando.set(false);
    }
  }
}
