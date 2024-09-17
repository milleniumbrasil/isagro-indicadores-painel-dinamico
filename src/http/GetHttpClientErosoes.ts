// src/services/GetHttpClientErosao.ts

import { IStackedAreaChart } from '../types';
import BaseGetHttpClient from './BaseGetHttpClient';

class GetHttpClientErosoes extends BaseGetHttpClient {

    constructor() {
        super(process.env.REACT_APP_API_BASE_URL, '/erosao');
    }

    public async getStackedData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/stacked');
    }

    public async getPercentualData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/percentuals');
    }

    // Adicionando método com parâmetro de label
    public async getPercentualDataByLabel(label: string): Promise<IStackedAreaChart[]> {
        const encodedLabel = encodeURIComponent(label); // Codifica o label para caracteres especiais
        return this.get<IStackedAreaChart[]>(`/percentuals/${encodedLabel}`);
    }
}

export default GetHttpClientErosoes;
