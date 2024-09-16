// src/services/GetOrganicaService.ts

import Service from './Service';
import { IPercentualAreaChart, IStackedAreaChart } from '../types';

class GetOrganicaService extends Service {

    constructor() {
        super(process.env.REACT_APP_API_BASE_URL, '/organicas');
    }

    public async getStackedData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/stacked');
    }

    public async getOrganicasAsPercentual(): Promise<IPercentualAreaChart[]> {
        return this.get<IPercentualAreaChart[]>('/percentual');
    }
}

export default GetOrganicaService;
