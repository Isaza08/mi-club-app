import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { ConquistadoresService, Conquistador } from '../../services/conquistadores.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mis-conquistadores',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mis-conquistadores.component.html',
  styleUrl: './mis-conquistadores.component.css'
})
export class MisConquistadoresComponent implements OnInit, OnDestroy {
  private conquistadoresService = inject(ConquistadoresService);
  private authService = inject(AuthService);

  conquistadores = signal<Conquistador[]>([]);
  nombreConsejero = signal<string | null>(null);
  cargando = signal(true);

  readonly fotoPorDefecto = 'https://api.dicebear.com/7.x/thumbs/svg?seed=conquistador';

  private sub?: Subscription;

  ngOnInit() {
    this.sub = combineLatest([
      this.authService.perfil$,
      this.conquistadoresService.getAll()
    ]).subscribe(([perfil, conquistadores]) => {
      if (!perfil) {
        this.conquistadores.set([]);
        this.nombreConsejero.set(null);
        this.cargando.set(false);
        return;
      }
      this.nombreConsejero.set(perfil.nombre);
      this.conquistadores.set(conquistadores.filter(c => c.consejero_uid === perfil.uid));
      this.cargando.set(false);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'Elegible':
      case 'Investido': return 'badge-done';
      case 'En Progreso': return 'badge-progress';
      case 'Riesgo': return 'badge-pending';
      default: return 'badge-pending';
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
}
