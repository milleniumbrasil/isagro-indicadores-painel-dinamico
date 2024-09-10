// src/components/ISAgro/types.ts

export interface IRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
}

export interface IResponse {
  status: number;
  headers: Record<string, string>;
  data: any;
}

export interface IData {
  geocodigo: number;
  data: Date;
  fonte: string;
  valor: number;
}

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

export interface IOrganica {
  year: number;
  area: number;
  setor: string;
}

export interface IOrganicaBySetor {
  year: number;
  hortalicas: number;
  fruticultura: number;
  pastagem: number;
  grao: number;
}

