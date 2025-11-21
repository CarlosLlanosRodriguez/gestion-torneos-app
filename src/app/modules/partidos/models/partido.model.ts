// Interface para Partido completo
export interface Partido {
    id: number;
    torneo_id: number;
    torneo_nombre: string;
    torneo_disciplina: string;
    torneo_fecha_inicio?: string;
    torneo_fecha_fin?: string;
    torneo_organizador_id?: number;
    equipo_local_id: number;
    equipo_local_nombre: string;
    equipo_local_color: string;
    equipo_visitante_id: number;
    equipo_visitante_nombre: string;
    equipo_visitante_color: string;
    fecha: string;
    lugar: string;
    marcador_local: number;
    marcador_visitante: number;
    estado: 'pendiente' | 'en_curso' | 'finalizado' | 'cancelado';
    observaciones: string | null;
    creado_en: string;
    actualizado_en: string;
    total_eventos: string;
}

// Interface para Partido en listados
export interface PartidoListado {
    id: number;
    torneo_id: number;
    torneo_nombre: string;
    torneo_disciplina: string;
    equipo_local_id: number;
    equipo_local_nombre: string;
    equipo_local_color: string;
    equipo_visitante_id: number;
    equipo_visitante_nombre: string;
    equipo_visitante_color: string;
    fecha: string;
    lugar: string;
    marcador_local: number;
    marcador_visitante: number;
    estado: 'pendiente' | 'en_curso' | 'finalizado' | 'cancelado';
    observaciones: string | null;
    total_eventos: string;
    creado_en: string;
    actualizado_en: string;
}

// Interface para crear partido
export interface PartidoCreateForm {
    torneo_id: number;
    equipo_local_id: number;
    equipo_visitante_id: number;
    fecha: string;
    lugar: string;
    estado: 'pendiente' | 'en_curso' | 'finalizado' | 'cancelado';
}

// Interface para actualizar partido
export interface PartidoUpdateForm {
    fecha: string;
    lugar: string;
    marcador_local: number;
    marcador_visitante: number;
    estado: 'pendiente' | 'en_curso' | 'finalizado' | 'cancelado';
    observaciones?: string;
}

// Opciones de estado del partido
export const ESTADOS_PARTIDO = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_curso', label: 'En Curso' },
    { value: 'finalizado', label: 'Finalizado' },
    { value: 'cancelado', label: 'Cancelado' },
];

// Interface para respuesta de petición HTTP
export interface PartidoResponse {
    id: number;
    torneo_id: number;
    equipo_local_id: number;
    equipo_visitante_id: number;
    fecha: Date;
    lugar: string;
    marcador_local: number;
    marcador_visitante: number;
    estado: string;
    observaciones: null | string;
    creado_en?: Date;
    actualizado_en?: Date;
}
