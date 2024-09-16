// src/services/GetErosaoDataService.ts

import { IStackedAreaChart } from '../types';
import Service from './Service';

class GetErosaoDataService extends Service {

    constructor() {
        super(process.env.REACT_APP_API_BASE_URL, '/erosao');
    }

    public async getStackedData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/stacked');
    }

    public async getPercentualData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/percentual');
    }

    // Adicionando método com parâmetro de label
    public async getPercentualDataByLabel(label: string): Promise<IStackedAreaChart[]> {
        const encodedLabel = encodeURIComponent(label); // Codifica o label para caracteres especiais
        return this.get<IStackedAreaChart[]>(`/percentual/${encodedLabel}`);
    }
}

export default GetErosaoDataService;
