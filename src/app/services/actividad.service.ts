import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Observable } from 'rxjs';
import { collection, query, orderBy, limit } from 'firebase/firestore';

export interface Actividad {
  id?: string;
  tipo: 'pagina_completada' | 'especialidad_entregada' | 'investidura';
  conquistador_id: string;
  conquistador_nombre: string;
  detalle: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private fbService = inject(FirebaseService);
  private readonly COLLECTION = 'actividad';

  getRecientes(cantidad = 8): Observable<Actividad[]> {
    const ref = collection(this.fbService.db, this.COLLECTION);
    const q = query(ref, orderBy('fecha', 'desc'), limit(cantidad));
    return this.fbService.getCollection<Actividad>(q);
  }

  async registrar(actividad: Omit<Actividad, 'id'>): Promise<void> {
    await this.fbService.addDocument(this.COLLECTION, actividad);
  }
}
