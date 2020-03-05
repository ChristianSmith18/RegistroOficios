export interface DireccionesOficios {
    santiagoCentro: StgoCentro[];
}

export interface StgoCentro {
    calle: string;
    lugar: string;
    mapa: string;
    numero: number;
    piso: number;
    fecha: string;
    isHorario: boolean;
    horario?: string;
}
