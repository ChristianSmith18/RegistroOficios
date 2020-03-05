export interface MisOficios {
    oficios: Oficios[];
}

export interface Oficios {
    fecha: string;
    cantOficios: number;
    cantOficiosEntregados: number;
    cantPersonas: number;
    finalizado: boolean;
    nombreListado: string;
    personas: Personas[];
}

export interface Personas {
    oficios: OficiosPersonas[];
    nombre: string;
}

export interface OficiosPersonas {
    calle: string;
    entregado: boolean;
    lugar: string;
    mapa: string;
    numero: string;
}
