// src/services/GetHttpClientPesticidas.ts

import { IStackedAreaChart } from '../types';
import BaseGetHttpClient from './BaseGetHttpClient';

class GetHttpClientPesticidas extends BaseGetHttpClient {

    constructor() {
        super(process.env.REACT_APP_API_BASE_URL, '/pesticidas');
    }

    public async getStackedData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/stacked');
    }

    public async getPercentualData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/percentuals');
    }
}

export default GetHttpClientPesticidas;
