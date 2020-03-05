export interface MiListadoOficios {
    oficios: OficiosListado[];
}

export interface OficiosListado {
    fecha: string;
    numberFoto: number;
    finalizado: boolean;
    nombreListado: string;
    cantPersonas: number;
    cantOficios: number;
    personas: PersonasListado[];
}

export interface PersonasListado {
    nombre: string;
    oficios: OficiosListadoPersonas[];
}

export interface OficiosListadoPersonas {
    lugar: string;
    calle: string;
    numero: number;
    piso: number;
    mapa: string;
    horario?: string;
    isHorario: boolean;
    entregado: boolean;
    fechaEntrega?: string;
}

