// Interface para Evento completo (con detalles)
export interface Evento {
    id: number;
    partido_id: number;
    partido_fecha: string;
    equipo_local_id?: number;
    equipo_local: string;
    equipo_visitante_id?: number;
    equipo_visitante: string;
    torneo_organizador_id?: number;
    jugador_id: number;
    jugador_nombre: string;
    nro_camiseta: number;
    jugador_equipo_id?: number;
    equipo_jugador: string;
    tipo: 'gol' | 'tarjeta_amarilla' | 'tarjeta_roja' | 'cambio' | 'lesion';
    minuto: number;
    descripcion: string;
    creado_en: string;
}

// Interface para Evento en listados
export interface EventoListado {
    id: number;
    partido_id: number;
    partido_fecha: string;
    equipo_local: string;
    equipo_visitante: string;
    jugador_id: number;
    jugador_nombre: string;
    nro_camiseta: number;
    equipo_jugador: string;
    equipo_nombre?: string;
    tipo: 'gol' | 'tarjeta_amarilla' | 'tarjeta_roja' | 'cambio' | 'lesion';
    minuto: number;
    descripcion: string;
    creado_en: string;
}

// Interface para crear/actualizar evento
export interface EventoForm {
    partido_id?: number; // Solo para crear
    jugador_id?: number; // Solo para crear
    tipo: 'gol' | 'tarjeta_amarilla' | 'tarjeta_roja' | 'cambio' | 'lesion';
    minuto: number;
    descripcion: string;
}

// Interface para goleadores
export interface Goleador {
    jugador_id: number;
    jugador_nombre: string;
    nro_camiseta: number;
    equipo_nombre: string;
    goles: string;
}

// Tipos de eventos disponibles
export const TIPOS_EVENTO = [
    { value: 'gol', label: 'Gol', icon: '⚽', color: '#28a745' },
    { value: 'tarjeta_amarilla', label: 'Tarjeta Amarilla', icon: '🟨', color: '#ffc107' },
    { value: 'tarjeta_roja', label: 'Tarjeta Roja', icon: '🟥', color: '#dc3545' },
    { value: 'cambio', label: 'Cambio', icon: '🔄', color: '#17a2b8' },
    { value: 'lesion', label: 'Lesión', icon: '🩹', color: '#6c757d' }
];

// Interface para respuestas de petición http
export interface EventoResponse {
    id: number;
    partido_id: number;
    jugador_id: number;
    tipo: string;
    minuto: number;
    descripcion: string;
    creado_en: Date;
}