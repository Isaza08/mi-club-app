import { Component } from '@angular/core';

export interface Especialidad {
  id: string;
  nombre: string;
  categoria: string;
  logo_url: string;
  asignados_count: number;
}

@Component({
  selector: 'app-especialidades',
  standalone: true,
  templateUrl: './especialidades.component.html',
  styleUrl: './especialidades.component.css'
})
export class EspecialidadesComponent {
  especialidades: Especialidad[] = [
    {
      id: 'ESP-001',
      nombre: 'Nudos y Amarres',
      categoria: 'Artes Domésticas / Habilidades',
      logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Nudos&backgroundColor=F59E0B',
      asignados_count: 24
    },
    {
      id: 'ESP-002',
      nombre: 'Primeros Auxilios',
      categoria: 'Salud y Ciencia',
      logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Auxilios&backgroundColor=EF4444',
      asignados_count: 35
    },
    {
      id: 'ESP-003',
      nombre: 'Arte de Acampar',
      categoria: 'Actividades Recreativas',
      logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Acampar&backgroundColor=10B981',
      asignados_count: 18
    },
    {
      id: 'ESP-004',
      nombre: 'Astronomía',
      categoria: 'Estudio de la Naturaleza',
      logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Astro&backgroundColor=3B82F6',
      asignados_count: 12
    },
    {
      id: 'ESP-005',
      nombre: 'Liderazgo',
      categoria: 'Desarrollo Profesional',
      logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Lider&backgroundColor=8B5CF6',
      asignados_count: 5
    }
  ];
}
