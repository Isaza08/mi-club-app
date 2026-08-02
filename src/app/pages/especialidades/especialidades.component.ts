import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EspecialidadesService, Especialidad } from '../../services/especialidades.service';
import {
  ConquistadoresService,
  Conquistador,
  EspecialidadAsignada,
  EstadoEspecialidad,
  calcularEstadoEspecialidad
} from '../../services/conquistadores.service';
import { ActividadService } from '../../services/actividad.service';
import { AuthService, PerfilUsuario } from '../../services/auth.service';
import { combineLatest } from 'rxjs';

const CATEGORIAS = [
  'ADRA',
  'Artes y habilidades manuales',
  'Actividades agrícolas',
  'Actividades misioneras y comunitarias',
  'Actividades profesionales',
  'Actividades recreativas',
  'Ciencia y salud',
  'Estudio de la naturaleza',
  'Habilidades domésticas'
];

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './especialidades.component.html',
  styleUrl: './especialidades.component.css'
})
export class EspecialidadesComponent implements OnInit, OnDestroy {
  private especialidadesService = inject(EspecialidadesService);
  private conquistadoresService = inject(ConquistadoresService);
  private actividadService = inject(ActividadService);
  private authService = inject(AuthService);

  especialidades: Especialidad[] = [];
  conquistadores: Conquistador[] = [];
  perfil: PerfilUsuario | null = null;
  filtro = '';
  cargando = signal(true);

  readonly logoPorDefecto = 'https://api.dicebear.com/7.x/shapes/svg?seed=especialidad';
  readonly categorias = CATEGORIAS;

  mostrarModal = signal(false);
  editandoId = signal<string | null>(null);
  guardando = signal(false);
  formData: Omit<Especialidad, 'id'> = this.formularioVacio();

  mostrarModalAsignar = signal(false);
  especialidadAsignando: Especialidad | null = null;
  seleccionAsignados = new Set<string>();

  mostrarModalDetalle = signal(false);
  especialidadDetalle: Especialidad | null = null;

  private subEspecialidades?: Subscription;
  private subConquistadores?: Subscription;

  ngOnInit() {
    this.cargando.set(true);
    this.subEspecialidades = this.especialidadesService.getAll().subscribe(data => {
      this.especialidades = data;
      this.cargando.set(false);
    });
    this.subConquistadores = combineLatest([
      this.authService.perfil$,
      this.conquistadoresService.getAll()
    ]).subscribe(([perfil, data]) => {
      this.perfil = perfil ?? null;
      this.conquistadores = data;
    });
  }

  ngOnDestroy() {
    this.subEspecialidades?.unsubscribe();
    this.subConquistadores?.unsubscribe();
  }

  get esAdmin(): boolean {
    return this.perfil?.rol === 'Administrador';
  }

  // Los consejeros solo pueden asignar/ver sus propios conquistadores; el Admin ve todos.
  conquistadoresAsignables(): Conquistador[] {
    return this.esAdmin
      ? this.conquistadores
      : this.conquistadores.filter(c => c.consejero_uid === this.perfil?.uid);
  }

  especialidadesFiltradas(): Especialidad[] {
    const termino = this.filtro.trim().toLowerCase();
    if (!termino) return this.especialidades;
    return this.especialidades.filter(e => e.nombre.toLowerCase().includes(termino));
  }

  private asignacionesDe(especialidadId: string | undefined): { conquistador: Conquistador; asignacion: EspecialidadAsignada }[] {
    if (!especialidadId) return [];
    const resultado: { conquistador: Conquistador; asignacion: EspecialidadAsignada }[] = [];
    for (const c of this.conquistadores) {
      const asignacion = c.especialidades?.find(e => e.especialidad_id === especialidadId);
      if (asignacion) resultado.push({ conquistador: c, asignacion });
    }
    return resultado;
  }

  totalAsignados(especialidadId: string | undefined): number {
    return this.asignacionesDe(especialidadId).length;
  }

  totalEntregados(esp: Especialidad): number {
    return this.asignacionesDe(esp.id)
      .filter(a => calcularEstadoEspecialidad(a.asignacion, esp.fecha_entrega) === 'Entregada').length;
  }

  getBadgeClass(estado: EstadoEspecialidad): string {
    switch (estado) {
      case 'Entregada': return 'badge-done';
      case 'En Progreso': return 'badge-progress';
      case 'Sin Entregar': return 'badge-pending';
    }
  }

  abrirCrear() {
    this.editandoId.set(null);
    this.formData = this.formularioVacio();
    this.mostrarModal.set(true);
  }

  abrirEditar(e: Especialidad) {
    this.editandoId.set(e.id ?? null);
    this.formData = {
      nombre: e.nombre,
      categoria: e.categoria,
      logo_url: e.logo_url,
      fecha_inicio: e.fecha_inicio,
      fecha_entrega: e.fecha_entrega
    };
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }

  async guardar() {
    this.guardando.set(true);
    try {
      const id = this.editandoId();
      if (id) {
        await this.especialidadesService.update(id, this.formData);
      } else {
        await this.especialidadesService.create(this.formData);
      }
      this.mostrarModal.set(false);
    } finally {
      this.guardando.set(false);
    }
  }

  async eliminar(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta especialidad?')) {
      await this.especialidadesService.delete(id);
    }
  }

  // ─── Asignación ────────────────────────────────────────────────
  abrirAsignar(e: Especialidad) {
    this.especialidadAsignando = e;
    this.seleccionAsignados = new Set(
      this.conquistadoresAsignables().filter(c => c.especialidades?.some(x => x.especialidad_id === e.id)).map(c => c.id!)
    );
    this.mostrarModalAsignar.set(true);
  }

  cerrarModalAsignar() {
    this.mostrarModalAsignar.set(false);
    this.especialidadAsignando = null;
  }

  toggleAsignado(conquistadorId: string) {
    if (this.seleccionAsignados.has(conquistadorId)) {
      this.seleccionAsignados.delete(conquistadorId);
    } else {
      this.seleccionAsignados.add(conquistadorId);
    }
  }

  todosSeleccionados(): boolean {
    const asignables = this.conquistadoresAsignables();
    return asignables.length > 0 && asignables.every(c => this.seleccionAsignados.has(c.id!));
  }

  asignarATodoElClub() {
    if (this.todosSeleccionados()) {
      this.seleccionAsignados.clear();
    } else {
      this.seleccionAsignados = new Set(this.conquistadoresAsignables().map(c => c.id!));
    }
  }

  async guardarAsignacion() {
    const especialidadId = this.especialidadAsignando?.id;
    if (!especialidadId) return;

    this.guardando.set(true);
    try {
      const actualizaciones = this.conquistadoresAsignables().map(async c => {
        const existente = c.especialidades ?? [];
        const yaAsignado = existente.some(e => e.especialidad_id === especialidadId);
        const debeEstarAsignado = this.seleccionAsignados.has(c.id!);
        if (yaAsignado === debeEstarAsignado) return;

        const nuevasEspecialidades = debeEstarAsignado
          ? [...existente, {
              especialidad_id: especialidadId,
              estado: 'En Progreso' as const,
              fecha_entrega_real: null
            }]
          : existente.filter(e => e.especialidad_id !== especialidadId);

        await this.conquistadoresService.update(c.id!, { especialidades: nuevasEspecialidades });
      });

      await Promise.all(actualizaciones);
      this.cerrarModalAsignar();
    } finally {
      this.guardando.set(false);
    }
  }

  // ─── Detalle ───────────────────────────────────────────────────
  abrirDetalle(e: Especialidad) {
    this.especialidadDetalle = e;
    this.mostrarModalDetalle.set(true);
  }

  cerrarDetalle() {
    this.mostrarModalDetalle.set(false);
    this.especialidadDetalle = null;
  }

  asignacionesDetalle(): { conquistador: Conquistador; asignacion: EspecialidadAsignada }[] {
    return this.asignacionesDe(this.especialidadDetalle?.id);
  }

  estadoDe(asignacion: EspecialidadAsignada): EstadoEspecialidad {
    return calcularEstadoEspecialidad(asignacion, this.especialidadDetalle?.fecha_entrega);
  }

  async marcarEntregada(conquistador: Conquistador, asignacion: EspecialidadAsignada) {
    const especialidad = this.especialidadDetalle;
    if (!especialidad?.id || !conquistador.id) return;

    const marcandoEntregada = asignacion.estado !== 'Entregada';
    const nuevasEspecialidades = (conquistador.especialidades ?? []).map(e => {
      if (e.especialidad_id !== especialidad.id) return e;
      return marcandoEntregada
        ? { ...e, estado: 'Entregada' as const, fecha_entrega_real: new Date().toISOString().split('T')[0] }
        : { ...e, estado: 'En Progreso' as const, fecha_entrega_real: null };
    });

    await this.conquistadoresService.update(conquistador.id, { especialidades: nuevasEspecialidades });

    if (marcandoEntregada) {
      await this.actividadService.registrar({
        tipo: 'especialidad_entregada',
        conquistador_id: conquistador.id,
        conquistador_nombre: conquistador.nombre,
        detalle: especialidad.nombre,
        fecha: new Date().toISOString()
      });
    }
  }

  private formularioVacio(): Omit<Especialidad, 'id'> {
    return { nombre: '', categoria: '', logo_url: '', fecha_inicio: null, fecha_entrega: null };
  }
}
