// src/services/GetHttpClientPoluicao.ts

import { IStackedAreaChart } from '../components/charts/IStackedAreaChart';
import { IPercentualAreaChart } from '../components/charts/IPercentualAreaChart';
import BaseGetHttpClient from './BaseGetHttpClient';

class GetHttpClientPoluicao extends BaseGetHttpClient {

    constructor() {
        super(process.env.REACT_APP_API_BASE_URL, '/poluicoes');
    }

    public async getStackedData(): Promise<IStackedAreaChart[]> {
        return this.get<IStackedAreaChart[]>('/stacked');
    }

    public async getStackedDataByPeriod(period: string): Promise<IStackedAreaChart[]> {
		this.periodValidation(period);
        return this.get<IStackedAreaChart[]>(`/${period}/stacked`);
    }

    public async getStackedDataByPeriodNState(period: string, state: string): Promise<IStackedAreaChart[]> {
		this.periodValidation(period);
        return this.get<IStackedAreaChart[]>(`/${period}/${state}/stacked`);
    }

    public async getPercentualData(): Promise<IPercentualAreaChart[]> {
        return this.get<IPercentualAreaChart[]>('/percentuals');
    }
}

export default GetHttpClientPoluicao;
