// src/services/GetNH3DataService.ts

import { IStackedAreaChart } from '../types';
import Service from './Service';

class GetNH3DataService extends Service {

    constructor() {
        super(process.env.REACT_APP_API_BASE_URL, '/nh3');
    }

    public async getStackedData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/stacked');
    }

    public async getPercentualData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/percentual');
    }
}

export default GetNH3DataService;
