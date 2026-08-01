import { Component, inject, OnInit, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ExportacionService, ConquistadorInvestidura } from '../../services/exportacion.service';
import { ConquistadoresService, Conquistador } from '../../services/conquistadores.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private exportacionService = inject(ExportacionService);
  private conquistadoresService = inject(ConquistadoresService);

  conquistadores$!: Observable<Conquistador[]>;
  conquistadores: Conquistador[] = [];
  cargando = signal(true);

  ngOnInit() {
    this.conquistadores$ = this.conquistadoresService.getAll();
    this.conquistadores$.subscribe(data => {
      this.conquistadores = data;
      this.cargando.set(false);
    });
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

  get excelenciaAvanzadaCount(): number {
    return this.conquistadores.filter(c => {
      const paginasAvanzadas = c.cartilla?.avanzada?.flatMap(sec => sec.paginas) || [];
      if (paginasAvanzadas.length === 0) return false;
      return paginasAvanzadas.every(p => p.estado === 'Terminada');
    }).length;
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
          especialidades: c.especialidades_ids || []
        };
      });

    this.exportacionService.exportarPedidoInvestidura(datosExportacion);
  }

  async cargarDatosMock() {
    await this.conquistadoresService.seedDatosMock();
  }
}
