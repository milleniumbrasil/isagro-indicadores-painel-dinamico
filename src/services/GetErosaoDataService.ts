// src/services/GetErosaoDataService.ts

import { IStackedAreaChart } from '../types';
import Service from './Service';

class GetErosaoDataService extends Service {
    public async getStackedData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/erosao/stacked');
    }

    public async getPercentualData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/erosao/percentual');
    }

    // Adicionando método com parâmetro de label
    public async getPercentualDataByLabel(label: string): Promise<IStackedAreaChart[]> {
        const encodedLabel = encodeURIComponent(label); // Codifica o label para caracteres especiais
        return this.get<IStackedAreaChart[]>(`/poluicao/percentual/${encodedLabel}`);
    }
}

export default GetErosaoDataService;
