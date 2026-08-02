import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ConquistadoresService, Conquistador } from '../../services/conquistadores.service';
import { FirebaseService } from '../../services/firebase.service';
import { UsuariosService, Usuario } from '../../services/usuarios.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type ConquistadorForm = Omit<Conquistador, 'id' | 'clase_id' | 'cartilla' | 'especialidades' | 'estado_investidura'>;

@Component({
  selector: 'app-conquistadores',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './conquistadores.component.html',
  styleUrl: './conquistadores.component.css'
})
export class ConquistadoresComponent implements OnInit, OnDestroy {
  private conquistadoresService = inject(ConquistadoresService);
  private firebaseService = inject(FirebaseService);
  private usuariosService = inject(UsuariosService);

  conquistadores: Conquistador[] = [];
  consejeros: Usuario[] = [];
  filtro = '';
  cargando = signal(true);

  readonly fotoPorDefecto = 'https://api.dicebear.com/7.x/thumbs/svg?seed=conquistador';

  mostrarModal = signal(false);
  editandoId = signal<string | null>(null);
  guardando = signal(false);
  subiendoFoto = signal(false);

  formData: ConquistadorForm = this.formularioVacio();

  private fotoFile: File | null = null;
  private fotoUrl: string | undefined;
  private subscripcion?: Subscription;
  private subConsejeros?: Subscription;

  ngOnInit() {
    this.cargando.set(true);
    this.subscripcion = this.conquistadoresService.getAll().subscribe(data => {
      this.conquistadores = data;
      this.cargando.set(false);
    });
    this.subConsejeros = this.usuariosService.getConsejeros().subscribe(data => this.consejeros = data);
  }

  ngOnDestroy() {
    this.subscripcion?.unsubscribe();
    this.subConsejeros?.unsubscribe();
  }

  conquistadoresFiltrados(): Conquistador[] {
    const termino = this.filtro.trim().toLowerCase();
    if (!termino) return this.conquistadores;
    return this.conquistadores.filter(c => c.nombre.toLowerCase().includes(termino));
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'Elegible':    return 'badge-done';
      case 'En Progreso': return 'badge-progress';
      case 'Riesgo':      return 'badge-pending';
      case 'Investido':   return 'badge-done';
      default:            return 'badge-pending';
    }
  }

  getPorcentajeRegular(c: Conquistador): number {
    const paginas = c.cartilla?.regular?.flatMap(s => s.paginas) || [];
    if (paginas.length === 0) return 0;
    const terminadas = paginas.filter(p => p.estado === 'Terminada').length;
    return Math.round((terminadas / paginas.length) * 100);
  }

  getPorcentajeAvanzada(c: Conquistador): number {
    const paginas = c.cartilla?.avanzada?.flatMap(s => s.paginas) || [];
    if (paginas.length === 0) return 0;
    const terminadas = paginas.filter(p => p.estado === 'Terminada').length;
    return Math.round((terminadas / paginas.length) * 100);
  }

  async eliminar(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este conquistador?')) {
      await this.conquistadoresService.delete(id);
    }
  }

  abrirCrear() {
    this.editandoId.set(null);
    this.formData = this.formularioVacio();
    this.fotoFile = null;
    this.fotoUrl = undefined;
    this.mostrarModal.set(true);
  }

  abrirEditar(c: Conquistador) {
    this.editandoId.set(c.id ?? null);
    this.formData = {
      nombre: c.nombre,
      clase_nombre: c.clase_nombre,
      edad: c.edad,
      consejero_uid: c.consejero_uid,
      consejero_nombre: c.consejero_nombre
    };
    this.fotoFile = null;
    this.fotoUrl = c.foto_url;
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }

  onFotoSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    this.fotoFile = input.files?.[0] ?? null;
  }

  onConsejeroSeleccionado(uid: string) {
    const consejero = this.consejeros.find(c => c.id === uid);
    this.formData.consejero_uid = uid;
    this.formData.consejero_nombre = consejero?.nombre ?? '';
  }

  async guardar() {
    this.guardando.set(true);
    try {
      if (this.fotoFile) {
        this.subiendoFoto.set(true);
        const path = `conquistadores/${Date.now()}_${this.fotoFile.name}`;
        this.fotoUrl = await this.firebaseService.uploadFile(path, this.fotoFile);
        this.subiendoFoto.set(false);
      }

      const claseId = this.formData.clase_nombre.toLowerCase();
      const id = this.editandoId();

      if (id) {
        await this.conquistadoresService.update(id, {
          ...this.formData,
          clase_id: claseId,
          ...(this.fotoUrl ? { foto_url: this.fotoUrl } : {})
        });
      } else {
        await this.conquistadoresService.create({
          ...this.formData,
          clase_id: claseId,
          ...(this.fotoUrl ? { foto_url: this.fotoUrl } : {}),
          estado_investidura: 'En Progreso',
          cartilla: { regular: [], avanzada: [] },
          especialidades: []
        });
      }

      this.mostrarModal.set(false);
    } finally {
      this.guardando.set(false);
    }
  }

  private formularioVacio(): ConquistadorForm {
    return {
      nombre: '',
      clase_nombre: 'Amigo',
      edad: 10,
      consejero_uid: '',
      consejero_nombre: ''
    };
  }
}
