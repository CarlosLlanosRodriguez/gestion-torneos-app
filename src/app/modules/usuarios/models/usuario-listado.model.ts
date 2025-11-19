export interface UsuarioListado {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    activo: boolean;
    rol_id: number;
    rol_nombre: string;
    creado_en: string;
    actualizado_en: string;
}

export interface UsuarioForm {
    nombre: string;
    apellido: string;
    email: string;
    password?: string;
    rol_id: number;
    telefono: string;
    activo?: boolean;
}

export interface CambiarPasswordForm {
    password: string;
}

export interface UsuarioResponse {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol_id: number;
    telefono: string;
    activo: boolean;
    creado_en?: Date;
    actualizado_en?: Date;
}