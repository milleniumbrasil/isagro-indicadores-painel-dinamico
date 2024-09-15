// src/services/GetNPKDataService.ts

import { IStackedAreaChart } from '../types';
import Service from './Service';

class GetNPKDataService extends Service {
    public async getStackedData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/npk/stacked');
    }

    public async getPercentualData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/npk/percentual');
    }
}

export default GetNPKDataService;
