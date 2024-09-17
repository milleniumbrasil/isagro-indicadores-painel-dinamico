// src/services/GetOrganicaService.ts

import BaseGetHttpClient from './BaseGetHttpClient';
import { IPercentualAreaChart, IStackedAreaChart } from '../types';

class GetHttpClientOrganica extends BaseGetHttpClient {

    constructor() {
        super(process.env.REACT_APP_API_BASE_URL, '/organicas');
    }

    public async getStackedData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/stacked');
    }

    public async getOrganicasAsPercentual(): Promise<IPercentualAreaChart[]> {
        return this.get<IPercentualAreaChart[]>('/percentuals');
    }
}

export default GetHttpClientOrganica;
