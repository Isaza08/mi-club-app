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
  consejero: string;
  estado_investidura: 'Elegible' | 'En Progreso' | 'Riesgo' | 'Investido';
  foto_url?: string;
  cartilla?: {
    regular: SeccionCartilla[];
    avanzada: SeccionCartilla[];
  };
  especialidades_ids?: string[];
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

  // Carga datos iniciales de prueba en Firestore (sólo ejecutar una vez)
  async seedDatosMock(): Promise<void> {
    const mocks: Omit<Conquistador, 'id'>[] = [
      {
        nombre: 'Mateo Gómez',
        clase_id: 'companero',
        clase_nombre: 'Compañero',
        edad: 13,
        consejero: 'Peniel Chacón',
        estado_investidura: 'Elegible',
        cartilla: {
          regular: [
            {
              titulo: 'I. Generalidades',
              estado_seccion: 'En progreso',
              paginas: [
                { numero_pagina: 4, estado: 'Terminada', fecha_realizacion: '2026-05-12' },
                { numero_pagina: 5, estado: 'En progreso', fecha_realizacion: null },
                { numero_pagina: 6, estado: 'Por hacer', fecha_realizacion: null }
              ]
            }
          ],
          avanzada: [
            {
              titulo: 'Sección Avanzada',
              estado_seccion: 'Terminada',
              paginas: [
                { numero_pagina: 22, estado: 'Terminada', fecha_realizacion: '2026-06-01' }
              ]
            }
          ]
        },
        especialidades_ids: ['ESP-001', 'ESP-002']
      },
      {
        nombre: 'Sofía López',
        clase_id: 'amigo',
        clase_nombre: 'Amigo',
        edad: 11,
        consejero: 'Peniel Chacón',
        estado_investidura: 'Elegible',
        cartilla: {
          regular: [
            {
              titulo: 'I. Generalidades',
              estado_seccion: 'En progreso',
              paginas: [
                { numero_pagina: 1, estado: 'Terminada', fecha_realizacion: '2026-04-10' },
                { numero_pagina: 2, estado: 'Por hacer', fecha_realizacion: null }
              ]
            }
          ],
          avanzada: []
        },
        especialidades_ids: ['ESP-003']
      },
      {
        nombre: 'David Rojas',
        clase_id: 'explorador',
        clase_nombre: 'Explorador',
        edad: 14,
        consejero: 'Peniel Chacón',
        estado_investidura: 'Riesgo',
        cartilla: {
          regular: [
            {
              titulo: 'I. Generalidades',
              estado_seccion: 'Por hacer',
              paginas: [
                { numero_pagina: 10, estado: 'Por hacer', fecha_realizacion: null }
              ]
            }
          ],
          avanzada: []
        },
        especialidades_ids: []
      }
    ];

    for (const m of mocks) {
      await this.create(m);
    }
    console.log('✅ Datos semilla cargados en Firestore.');
  }
}
