// Interface para Equipo completo (con detalles)
export interface Equipo {
    id: number;
    nombre: string;
    color: string;
    representante: string;
    telefono_representante: string;
    torneo_id: number;
    torneo_nombre: string;
    torneo_disciplina: string;
    torneo_estado: string;
    torneo_organizador_id: number;
    total_jugadores: string;
    creado_en: string;
    actualizado_en: string;
}

// Interface para Equipo en listados
export interface EquipoListado {
    id: number;
    nombre: string;
    color: string;
    representante: string;
    telefono_representante: string;
    torneo_id: number;
    torneo_nombre: string;
    torneo_disciplina: string;
    torneo_estado: string;
    total_jugadores: string;
    creado_en: string;
    actualizado_en: string;
}

// Interface para crear/actualizar equipo
export interface EquipoForm {
    nombre: string;
    color: string;
    representante: string;
    telefono_representante: string;
    torneo_id?: number; // Opcional en actualización
}

// Interface para respuesta de petición
export interface EquipoResponse {
    id: number;
    nombre: string;
    color: string;
    representante: string;
    telefono_representante: string;
    torneo_id: number;
    creado_en?: Date; // Opcional
    actualizado_en?: Date; // Opcional
}
