// src/components/ISAgro/types.ts

export interface ICity {
    uf: string;
    cidade: string;
}

export interface IState {
    uf: string;
    estado: string;
}

export interface ICountry {
    iso: string;
    pais: string;
}

export interface IStackedAreaChart {
    period: string;
    entry: [label: string, value: number];
}
