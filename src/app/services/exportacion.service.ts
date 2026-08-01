import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

// Tipos para exportar
export interface ConquistadorInvestidura {
  nombre: string;
  clase: string;
  invisteRegular: boolean;
  invisteAvanzada: boolean;
  especialidades: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ExportacionService {

  constructor() { }

  exportarPedidoInvestidura(conquistadores: ConquistadorInvestidura[]) {
    // Filtrar solo los elegibles (aquellos que invisten al menos en algo, o tienen especialidades)
    // Según PRD: Solo a los conquistadores en estado "Elegible para Investidura"
    const elegibles = conquistadores.filter(c => c.invisteRegular);

    // 1. Pestaña 2: Detalle Nominativo (Auditoría Interna)
    const detalleRows = elegibles.map(c => ({
      'Conquistador': c.nombre,
      'Clase': c.clase,
      '¿Inviste Regular?': c.invisteRegular ? 'Sí' : 'No',
      '¿Inviste Avanzada?': c.invisteAvanzada ? 'Sí' : 'No',
      'Especialidades a Entregar': c.especialidades.join(', ') || 'Ninguna'
    }));

    // 2. Lógica de Conteo para Pestaña 1: Resumen Consolidado (Proveedor)
    const consolidado: Record<string, { tipo: string, cantidad: number, codigo: string }> = {};

    let correlativo = 1;

    elegibles.forEach(c => {
      // Botón de Clase Regular
      if (c.invisteRegular) {
        const itemNombre = `Botón de Clase: ${c.clase}`;
        if (!consolidado[itemNombre]) {
          consolidado[itemNombre] = { tipo: 'Botón', cantidad: 0, codigo: `BOT-${correlativo.toString().padStart(3, '0')}` };
          correlativo++;
        }
        consolidado[itemNombre].cantidad++;
      }

      // Barra/Cinta de Avanzado
      if (c.invisteAvanzada) {
        const itemNombre = `Barra Avanzada: ${c.clase}`;
        if (!consolidado[itemNombre]) {
          consolidado[itemNombre] = { tipo: 'Barra', cantidad: 0, codigo: `BAR-${correlativo.toString().padStart(3, '0')}` };
          correlativo++;
        }
        consolidado[itemNombre].cantidad++;
      }

      // Parches de Especialidades
      c.especialidades.forEach(esp => {
        const itemNombre = `Parche: ${esp}`;
        if (!consolidado[itemNombre]) {
          consolidado[itemNombre] = { tipo: 'Parche', cantidad: 0, codigo: `ESP-${correlativo.toString().padStart(3, '0')}` };
          correlativo++;
        }
        consolidado[itemNombre].cantidad++;
      });
    });

    const consolidadoRows = Object.keys(consolidado).map(nombre => ({
      'Código Ítem': consolidado[nombre].codigo,
      'Nombre de Insignia': nombre,
      'Tipo': consolidado[nombre].tipo,
      'Cantidad Total': consolidado[nombre].cantidad
    }));

    // Crear libro de trabajo (Workbook)
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Crear y añadir hojas (Worksheets)
    const wsConsolidado: XLSX.WorkSheet = XLSX.utils.json_to_sheet(consolidadoRows);
    const wsDetalle: XLSX.WorkSheet = XLSX.utils.json_to_sheet(detalleRows);

    XLSX.utils.book_append_sheet(wb, wsConsolidado, 'Resumen Consolidado');
    XLSX.utils.book_append_sheet(wb, wsDetalle, 'Detalle Nominativo');

    // Generar archivo y descargarlo
    const fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Pedido_Investidura_${fecha}.xlsx`);
  }
}
