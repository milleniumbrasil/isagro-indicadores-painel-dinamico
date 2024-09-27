// src/http/IGetHttpClient.ts

import { IPercentualAreaChart } from "../components/charts/IPercentualAreaChart";
import { IStackedAreaChart } from "../components/charts/IStackedAreaChart";

export interface IGetHttpClient {
    getStackedData(): Promise<IStackedAreaChart[]>;
    getStackedDataByPeriod(period: string): Promise<IStackedAreaChart[]>;
    getStackedDataByPeriodNState(period: string, state: string): Promise<IStackedAreaChart[]>;
    getPercentualData(): Promise<IPercentualAreaChart[]>;
}
