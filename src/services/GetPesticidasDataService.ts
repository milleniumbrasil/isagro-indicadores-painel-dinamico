// src/services/GetPesticidasDataService.ts

import { IStackedAreaChart } from '../types';
import Service from './Service';

class GetPesticidasDataService extends Service {
    public async getStackedData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/pesticidas/stacked');
    }
    public async getPercentualData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/pesticidas/percentual');
    }
}

export default GetPesticidasDataService;
