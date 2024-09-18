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
                console.warn(`[Service]: o corpo da resposta não é um array. ${JSON.stringify(response.data)}`);
			else
				console.log(`[Service]: Resposta de ${targetURL}: ${response.data.length} itens`);
            if (response.data === null || response.data === undefined)
                console.warn(`[Service]: data is required.`);
            return response.data;
        } catch (error) {
            throw new Error(`[Service]: Resposta de ${targetURL}: ${error}`);
        }
    }
}

