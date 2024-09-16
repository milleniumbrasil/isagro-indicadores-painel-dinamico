// src/services/GetPoluicaoDataService.ts

import { IStackedAreaChart } from '../types';
import Service from './Service';

class GetPoluicaoDataService extends Service {

    constructor() {
        super(process.env.REACT_APP_API_BASE_URL, '/poluicao');
    }

    public async getStackedData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/stacked');
    }

    public async getPercentualData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/percentual');
    }
}

export default GetPoluicaoDataService;
