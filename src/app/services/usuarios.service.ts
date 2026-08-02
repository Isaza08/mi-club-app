import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Observable, map } from 'rxjs';
import { collection, query, where } from 'firebase/firestore';

export interface Usuario {
  id?: string; // Coincide con el uid de Firebase Auth
  nombre: string;
  rol: 'Administrador' | 'Consejero';
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private fbService = inject(FirebaseService);
  private readonly COLLECTION = 'usuarios';

  getConsejeros(): Observable<Usuario[]> {
    const ref = collection(this.fbService.db, this.COLLECTION);
    // Se ordena en el cliente para no depender de un índice compuesto (where + orderBy) en Firestore.
    const q = query(ref, where('rol', '==', 'Consejero'));
    return this.fbService.getCollection<Usuario>(q).pipe(
      map(usuarios => [...usuarios].sort((a, b) => a.nombre.localeCompare(b.nombre)))
    );
  }
}
