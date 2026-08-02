import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Observable } from 'rxjs';
import { collection, query, orderBy } from 'firebase/firestore';

export interface Conquistador {
  id?: string;
  nombre: string;
  clase_id: string;
  clase_nombre: string;
  edad: number;
  consejero_uid: string;
  consejero_nombre: string;
  estado_investidura: 'Elegible' | 'En Progreso' | 'Riesgo' | 'Investido';
  foto_url?: string;
  cartilla?: {
    regular: SeccionCartilla[];
    avanzada: SeccionCartilla[];
  };
  especialidades?: EspecialidadAsignada[];
}

export interface EspecialidadAsignada {
  especialidad_id: string;
  estado: 'En Progreso' | 'Entregada';
  // Se llena solo al marcar la especialidad como Entregada (fecha real de entrega).
  fecha_entrega_real: string | null;
}

export type EstadoEspecialidad = 'En Progreso' | 'Entregada' | 'Sin Entregar';

// "Sin Entregar" solo aplica si ya pasó la fecha meta de entrega de la especialidad
// (configurada en el catálogo) y el conquistador no la ha marcado como entregada.
export function calcularEstadoEspecialidad(
  asignacion: EspecialidadAsignada,
  fechaEntregaEspecialidad: string | null | undefined
): EstadoEspecialidad {
  if (asignacion.estado === 'Entregada') return 'Entregada';

  const hoy = new Date().toISOString().split('T')[0];
  if (fechaEntregaEspecialidad && fechaEntregaEspecialidad < hoy) return 'Sin Entregar';

  return 'En Progreso';
}

export interface SeccionCartilla {
  titulo: string;
  estado_seccion: 'Por hacer' | 'En progreso' | 'Terminada';
  paginas: Pagina[];
}

export interface Pagina {
  numero_pagina: number;
  estado: 'Por hacer' | 'En progreso' | 'Terminada';
  fecha_realizacion: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ConquistadoresService {
  private fbService = inject(FirebaseService);
  private readonly COLLECTION = 'conquistadores';

  getAll(): Observable<Conquistador[]> {
    const ref = collection(this.fbService.db, this.COLLECTION);
    const q = query(ref, orderBy('nombre'));
    return this.fbService.getCollection<Conquistador>(q);
  }

  getById(id: string): Observable<Conquistador> {
    return this.fbService.getDocument<Conquistador>(`${this.COLLECTION}/${id}`);
  }

  async create(conquistador: Omit<Conquistador, 'id'>): Promise<void> {
    await this.fbService.addDocument(this.COLLECTION, conquistador);
  }

  async update(id: string, data: Partial<Conquistador>): Promise<void> {
    await this.fbService.updateDocument(`${this.COLLECTION}/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    await this.fbService.deleteDocument(`${this.COLLECTION}/${id}`);
  }

  // El estado se deriva del avance real de la cartilla regular, salvo que ya esté Investido:
  // ese estado solo se asigna manualmente al confirmar la entrega de la investidura.
  calcularEstadoInvestidura(
    cartilla: Conquistador['cartilla'],
    estadoActual: Conquistador['estado_investidura']
  ): Conquistador['estado_investidura'] {
    if (estadoActual === 'Investido') return 'Investido';

    const paginas = cartilla?.regular?.flatMap(s => s.paginas) ?? [];
    if (paginas.length > 0 && paginas.every(p => p.estado === 'Terminada')) {
      return 'Elegible';
    }
    return 'En Progreso';
  }
}
