# Plan de Implementación: Mi Club App

El objetivo de este proyecto es desarrollar "Mi Club App", una plataforma web progresiva (PWA) para la gestión de un Club de Conquistadores, permitiendo el control del avance de las cartillas, evaluación de investiduras, y pedidos de insignias.

## User Review Required

> [!IMPORTANT]
> Reviso este plan y por favor indícame si estás de acuerdo con la estructura propuesta para proceder con la generación de la aplicación Angular y configuración de Firebase.

## Open Questions

> [!WARNING]
> Antes de empezar, tengo un par de consultas para asegurar que vamos por buen camino:
> 1.  **Directorio de instalación:** ¿Deseas que cree el proyecto Angular dentro de la carpeta `c:\Users\Peniel\Documents\mi-club-app` o tienes otra ruta preferida?
> 2.  **Configuración de Firebase:** ¿Tienes ya creado un proyecto en Firebase (con Realtime Database/Firestore, Storage y Authentication configurados) o quieres que utilicemos mocks de datos (JSON) para la interfaz primero y luego integrarlo a Firebase?
> 3.  **UI/UX:** ¿Deseas utilizar alguna librería de componentes (ej. Angular Material, Tailwind CSS) o construimos todo con CSS puro (Vanilla CSS) según lo especificado en mis instrucciones de diseño general?

## Proposed Changes

### Configuración del Proyecto y Estructura Base

- Crear un nuevo proyecto Angular (v17+) con Standalone Components.
- Configurar PWA (Service Workers).
- Instalar e integrar Firebase (AngularFire) para Autenticación, Base de Datos y Storage.
- Instalar la librería `xlsx` (SheetJS) para exportación a Excel.

### Módulos a Desarrollar

#### 1. Autenticación y Perfil
- Módulo de login y gestión de roles (Administrador/Consejero).

#### 2. Dashboard Principal
- Panel de KPIs y métricas (Elegibles, Excelencia, En riesgo, Especialidades).
- Gráficos visuales del estado general del club.

#### 3. Gestión de Usuarios y Conquistadores
- CRUD de Conquistadores.
- Subida de fotos de perfil a Firebase Storage.
- Asignación de unidades y consejeros.

#### 4. Cartillas y Clases Progresivas
- Componente de visualización de la cartilla (Clase Regular, Avanzada, Evaluación Final).
- Lógica de estados del checklist (Por hacer, En progreso, Terminada) con registro de fecha automático.
- Cálculo en tiempo real del porcentaje de avance (elegibilidad).

#### 5. Especialidades
- Catálogo de especialidades (CRUD).
- Asignación masiva e individual.

#### 6. Exportación de Pedidos
- Módulo para generar y descargar el `.xlsx` con el consolidado del proveedor y detalle nominativo de investiduras.

## Verification Plan

### Automated Tests
- Ejecutar `ng test` para verificar el correcto funcionamiento de los servicios lógicos (cálculo de porcentajes, estados automáticos).

### Manual Verification
- Levantar la app localmente con `npm run dev` (o `ng serve`).
- Validar las vistas responsive desde el navegador.
- Probar el flujo completo: Crear conquistador -> Actualizar cartilla a 100% -> Generar Excel de Investidura.
