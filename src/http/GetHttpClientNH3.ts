// src/services/GetHttpClientNH3.ts

import { IStackedAreaChart } from '../types';
import BaseGetHttpClient from './BaseGetHttpClient';

class GetHttpClientNH3 extends BaseGetHttpClient {

    constructor() {
        super(process.env.REACT_APP_API_BASE_URL, '/nh3s');
    }

    public async getStackedData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/stacked');
    }

    public async getPercentualData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/percentuals');
    }
}

export default GetHttpClientNH3;
