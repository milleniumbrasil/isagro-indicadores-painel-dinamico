// src/services/GetNPKDataService.ts

import { IStackedAreaChart } from '../types';
import Service from './Service';

class GetNPKDataService extends Service {

    constructor() {
        super(process.env.REACT_APP_API_BASE_URL, '/npk');
    }

    public async getStackedData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/stacked');
    }

    public async getPercentualData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/percentual');
    }
}

export default GetNPKDataService;
