// src/services/GetGEEDataService.ts

import { IStackedAreaChart } from '../types';
import Service from './Service';

class GetGEEDataService extends Service {
    public async getStackedData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/gee/stacked');
    }

    public async getPercentualData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/gee/percentual');
    }
}

export default GetGEEDataService;
