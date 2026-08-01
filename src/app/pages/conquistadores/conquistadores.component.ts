import { Component, inject, OnInit } from '@angular/core';
import { ConquistadoresService, Conquistador } from '../../services/conquistadores.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-conquistadores',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './conquistadores.component.html',
  styleUrl: './conquistadores.component.css'
})
export class ConquistadoresComponent implements OnInit {
  private conquistadoresService = inject(ConquistadoresService);

  conquistadores$!: Observable<Conquistador[]>;

  ngOnInit() {
    this.conquistadores$ = this.conquistadoresService.getAll();
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

  async eliminar(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este conquistador?')) {
      await this.conquistadoresService.delete(id);
    }
  }
}
