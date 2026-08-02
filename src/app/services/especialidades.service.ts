import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Observable } from 'rxjs';
import { collection, query, orderBy } from 'firebase/firestore';

export interface Especialidad {
  id?: string;
  nombre: string;
  categoria: string;
  logo_url?: string;
  fecha_inicio: string | null;
  // Fecha meta de entrega para todos los asignados. Si se pasa sin marcar
  // "Entregada", el estado del conquistador se calcula como "Sin Entregar".
  fecha_entrega: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {
  private fbService = inject(FirebaseService);
  private readonly COLLECTION = 'especialidades';

  getAll(): Observable<Especialidad[]> {
    const ref = collection(this.fbService.db, this.COLLECTION);
    const q = query(ref, orderBy('nombre'));
    return this.fbService.getCollection<Especialidad>(q);
  }

  async create(especialidad: Omit<Especialidad, 'id'>): Promise<void> {
    await this.fbService.addDocument(this.COLLECTION, especialidad);
  }

  async update(id: string, data: Partial<Especialidad>): Promise<void> {
    await this.fbService.updateDocument(`${this.COLLECTION}/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    await this.fbService.deleteDocument(`${this.COLLECTION}/${id}`);
  }
}
