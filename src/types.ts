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
	geeStackedData: IStackedAreaChart[];
	nh3StackedData: IStackedAreaChart[];
	npkStackedData: IStackedAreaChart[];
	organicasStackedData: IStackedAreaChart[];
	organicasPercentual: IPercentualAreaChart[];
	poluicaoStackedData: IStackedAreaChart[];
	erosaoStackedData: IStackedAreaChart[];
	cities: ICity[];
	states: IState[];
	countries: ICountry[];
  }
