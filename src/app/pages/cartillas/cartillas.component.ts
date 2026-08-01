import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Tarea {
  id: number;
  titulo: string;
  estado: 'Por hacer' | 'En progreso' | 'Terminada';
  fecha_realizacion: string | null;
}

export interface SeccionCartilla {
  titulo: string;
  estado_seccion: 'Por hacer' | 'En progreso' | 'Terminada';
  tareas: Tarea[];
}

export interface CartillaMock {
  conquistador: string;
  clase_nombre: string;
  logo_url: string;
  regular: SeccionCartilla[];
  avanzada: SeccionCartilla[];
  evaluacion_final: {
    estado: 'Pendiente' | 'Aprobado';
    fecha_evaluacion: string | null;
  }
}

@Component({
  selector: 'app-cartillas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cartillas.component.html',
  styleUrl: './cartillas.component.css'
})
export class CartillasComponent {
  // Mock Data basada en la estructura del PRD
  cartillaActual: CartillaMock = {
    conquistador: 'Mateo Gómez',
    clase_nombre: 'Compañero',
    logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Companero&backgroundColor=4F46E5', // Placeholder logo
    regular: [
      {
        titulo: 'I. Generalidades',
        estado_seccion: 'En progreso',
        tareas: [
          { id: 4, titulo: 'Ley y Voto', estado: 'Terminada', fecha_realizacion: '2026-05-12' },
          { id: 5, titulo: 'Blanco y Lema', estado: 'En progreso', fecha_realizacion: null },
          { id: 6, titulo: 'Himno de los Conquistadores', estado: 'Por hacer', fecha_realizacion: null }
        ]
      },
      {
        titulo: 'II. Descubrimiento Espiritual',
        estado_seccion: 'Por hacer',
        tareas: [
          { id: 10, titulo: 'Memorizar versículos', estado: 'Por hacer', fecha_realizacion: null }
        ]
      }
    ],
    avanzada: [
      {
        titulo: 'Sección Avanzada Compañero',
        estado_seccion: 'Por hacer',
        tareas: [
          { id: 22, titulo: 'Primeros Auxilios Avanzado', estado: 'Por hacer', fecha_realizacion: null }
        ]
      }
    ],
    evaluacion_final: {
      estado: 'Pendiente',
      fecha_evaluacion: null
    }
  };

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'Terminada': 
      case 'Aprobado': return 'badge-done';
      case 'En progreso': return 'badge-progress';
      case 'Por hacer': 
      case 'Pendiente': return 'badge-pending';
      default: return 'badge-pending';
    }
  }

  toggleEstado(tarea: Tarea, seccion: SeccionCartilla) {
    if (tarea.estado === 'Por hacer') {
      tarea.estado = 'En progreso';
    } else if (tarea.estado === 'En progreso') {
      tarea.estado = 'Terminada';
      tarea.fecha_realizacion = new Date().toISOString().split('T')[0];
    } else {
      tarea.estado = 'Por hacer';
      tarea.fecha_realizacion = null;
    }
    
    this.actualizarEstadoSeccion(seccion);
  }

  private actualizarEstadoSeccion(seccion: SeccionCartilla) {
    const totalTareas = seccion.tareas.length;
    if (totalTareas === 0) return;

    const tareasTerminadas = seccion.tareas.filter(t => t.estado === 'Terminada').length;
    const tareasPorHacer = seccion.tareas.filter(t => t.estado === 'Por hacer').length;

    if (tareasTerminadas === totalTareas) {
      seccion.estado_seccion = 'Terminada';
    } else if (tareasPorHacer === totalTareas) {
      seccion.estado_seccion = 'Por hacer';
    } else {
      seccion.estado_seccion = 'En progreso';
    }
  }
}
