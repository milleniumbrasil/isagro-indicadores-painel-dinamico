// src/services/GetNH3DataService.ts

import { IStackedAreaChart } from '../types';
import Service from './Service';

class GetNH3DataService extends Service {
    public async getStackedData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/nh3/stacked');
    }

    public async getPercentualData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/nh3/percentual');
    }
}

export default GetNH3DataService;
