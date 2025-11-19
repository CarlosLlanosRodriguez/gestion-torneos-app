// Interface para Torneo completo (con detalles)
export interface Torneo {
    id: number;
    nombre: string;
    disciplina: string;
    temporada: string;
    fecha_inicio: string;
    fecha_fin: string;
    estado: 'planificado' | 'en_curso' | 'finalizado' | 'cancelado';
    descripcion: string;
    organizador_id: number;
    organizador_nombre: string;
    organizador_email: string;
    creado_en: string;
    actualizado_en: string;
    total_equipos: string;
    total_partidos?: string;
}

// Interface para Torneo en listados
export interface TorneoListado {
    id: number;
    nombre: string;
    disciplina: string;
    temporada: string;
    fecha_inicio: string;
    fecha_fin: string;
    estado: 'planificado' | 'en_curso' | 'finalizado' | 'cancelado';
    descripcion: string;
    organizador_id: number;
    organizador_nombre: string;
    organizador_email?: string;
    total_equipos: string;
    creado_en: string;
    actualizado_en: string;
}

// Interface para crear/actualizar torneo
export interface TorneoForm {
    nombre: string;
    disciplina: string;
    temporada: string;
    fecha_inicio: string;
    fecha_fin: string;
    estado: 'planificado' | 'en_curso' | 'finalizado' | 'cancelado';
    descripcion: string;
}

// Interface para respuesta crear/actualizar torneo
export interface TorneoResponse {
    id: number;
    nombre: string;
    disciplina: string;
    temporada: string;
    fecha_inicio: Date;
    fecha_fin: Date;
    estado: string;
    organizador_id: number;
    descripcion: string;
    creado_en?: Date;
    actualizado_en?: Date;
}

// Opciones de estado del torneo
export const ESTADOS_TORNEO = [
    { value: 'planificado', label: 'Planificado' },
    { value: 'en_curso', label: 'En Curso' },
    { value: 'finalizado', label: 'Finalizado' },
    { value: 'cancelado', label: 'Cancelado' },
];
