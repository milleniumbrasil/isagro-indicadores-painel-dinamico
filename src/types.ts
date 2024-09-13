// src/components/ISAgro/types.ts

import { Dispatch, SetStateAction } from "react"

export interface IRequest {
	method: string
	url: string
	headers: Record<string, string>
	body?: any
}

export interface IResponse {
	status: number
	headers: Record<string, string>
	data: any
}

export interface IData {
	geocodigo: number
	data: Date
	fonte: string
	valor: number
}

export interface ICity {
	uf: string
	cidade: string
}

export interface IState {
	uf: string
	estado: string
}

export interface ICountry {
	iso: string
	pais: string
}

export interface IPercentualAreaChart {
	period: string
	value: number
}

export interface IStackedAreaChart {
	period: string
	entry: [label: string, value: number]
}

// Interface para o contexto
export interface ISAgroContextProps {
	data: IData[] | undefined;
	setData: Dispatch<SetStateAction<IData[] | undefined>>;
	years: string[] | undefined;
	setYears: Dispatch<SetStateAction<string[] | undefined>>;
	cities: ICity[] | undefined;
	setCities: Dispatch<SetStateAction<ICity[] | undefined>>;
	states: IState[] | undefined;
	setStates: Dispatch<SetStateAction<IState[] | undefined>>;
	countries: ICountry[] | undefined;
	setCountries: Dispatch<SetStateAction<ICountry[] | undefined>>;
	organicas: IStackedAreaChart[] | undefined;
	setOrganicas: Dispatch<SetStateAction<IStackedAreaChart[] | undefined>>;
	organicasPercentual: IPercentualAreaChart[] | undefined;
	setOrganicasPercentual: Dispatch<SetStateAction<IPercentualAreaChart[] | undefined>>;
  }
