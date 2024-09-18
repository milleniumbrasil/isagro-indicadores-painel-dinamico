// src/services/GetOrganicaService.ts

import BaseGetHttpClient from './BaseGetHttpClient';
import { IStackedAreaChart } from '../components/charts/types';
import { IPercentualAreaChart } from '../components/charts/IPercentualAreaChart';

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
