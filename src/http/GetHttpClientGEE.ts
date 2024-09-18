// src/services/GetHttpClientGEE.ts

import { IPercentualAreaChart, IStackedAreaChart } from '../types';
import BaseGetHttpClient from './BaseGetHttpClient';

class GetHttpClientGEE extends BaseGetHttpClient {

    constructor() {
        super(process.env.REACT_APP_API_BASE_URL, '/gees');
    }

    public async getStackedData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/stacked');
    }

    public async getPercentualData(): Promise<IPercentualAreaChart[]> {
        return this.get<IPercentualAreaChart[]>('/percentuals');
    }
}

export default GetHttpClientGEE;
