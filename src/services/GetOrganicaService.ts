// src/services/GetOrganicaService.ts

import axios, { AxiosResponse } from "axios"
import { IPercentualAreaChart, IStackedAreaChart } from "../types"

interface RequestHeaders {
	[key: string]: string
}

class GetOrganicaService {
	private baseURL: string
	private headers: RequestHeaders

	constructor(
		baseURL: string = process.env.REACT_APP_API_BASE_URL || "",
		headers: RequestHeaders = { accept: "*/*" },
	) {
		this.baseURL = baseURL
		this.headers = headers
	}

	public async getData(): Promise<IStackedAreaChart[] | { error: string }> {
		try {
			const targetURL = `${this.baseURL}/organicas/stacked`;
			const response: AxiosResponse<IStackedAreaChart> =
				await axios.get<IStackedAreaChart>(
					targetURL,
					{
						headers: this.headers,
					},
				)
			if (Array.isArray(response.data)) {
				return response.data
			} else {
				throw new Error(
					`A resposta de ${targetURL} não é um array. ${JSON.stringify(response.data)}`,
				)
			}
		} catch (error) {
			console.error("Erro ao realizar a requisição:", error)
			return { error: "Erro ao realizar a requisição" }
		}
	}

	public async getOrganicasAsPercentual(): Promise<
		IPercentualAreaChart[] | { error: string }
	> {
		const targetURL = `${this.baseURL}/organicas/percentual`;
		try {
			const response: AxiosResponse<IPercentualAreaChart> =
				await axios.get<IPercentualAreaChart>(
					targetURL,
					{
						headers: this.headers,
					},
				)
			if (Array.isArray(response.data)) {
				return response.data
			} else {
				throw new Error(
					`A resposta de ${targetURL} não é um array. ${JSON.stringify(response.data)}`,
				)
			}
		} catch (error) {
			console.error("Erro ao realizar a requisição:", error)
			return { error: "Erro ao realizar a requisição" }
		}
	}
}

export default GetOrganicaService
