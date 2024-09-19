// src/services/BaseGetHttpClient.ts

import axios, { AxiosResponse } from 'axios';

interface RequestHeaders {
    [key: string]: string;
}

export default class BaseGetHttpClient {
    protected baseURL: string;
    protected headers: RequestHeaders;
	protected basePath: string;

    constructor(baseURL: string = process.env.REACT_APP_API_BASE_URL || '', basePath = '', headers: RequestHeaders = { accept: '*/*' }) {
        this.baseURL = baseURL;
        this.headers = headers;
		this.basePath = basePath;
        if (!this.baseURL) {
            throw new Error('Base URL não pode ser vazia');
        }
    }

    // Método genérico para requisições GET
    protected async get<T>(endpoint: string): Promise<T> {
        const targetURL = `${this.baseURL}${this.basePath}${endpoint}`;
        try {
            const response: AxiosResponse<T> = await axios.get<T>(targetURL, {
                headers: this.headers,
            });
            if (!Array.isArray(response.data))
                console.warn(`[BaseGetHttpClient]: o corpo da resposta não é um array. ${JSON.stringify(response.data)}`);
			else
				console.log(`[BaseGetHttpClient]: Resposta de ${targetURL}: ${response.data.length} itens`);
            if (response.data === null || response.data === undefined)
                console.warn(`[BaseGetHttpClient]: data is required.`);
            return response.data;
        } catch (error) {
            throw new Error(`[BaseGetHttpClient]: Resposta de ${targetURL}: ${error}`);
        }
    }

    protected periodValidation(period: string): void {
		const periodRegex = /^\d{4}-\d{4}$/;
		if (!periodRegex.test(period)) {
			throw new Error(`[BaseGetHttpClient] O período [${period}] está no formato incorreto. O formato correto é 'ano-ano', como '1990-2000'.`);
		  }
	  }

	protected parsePeriod(period: string): number[] {
		const [anoInicial, anoFinal] = period.split('-');
		console.log(`[BaseGetHttpClient] parsePeriod: Ano Inicial: ${anoInicial}, Ano Final: ${anoFinal}`);
		return [parseInt(anoInicial), parseInt(anoFinal)];
	}
}

