// src/components/HelperProvider.ts

import { IGetHttpClient } from "../http/IGetHttpClient";
import { IStackedAreaChart } from "./charts/IStackedAreaChart";


export const fetchDataByPeriod = async (period: string, httpClient: IGetHttpClient): Promise<IStackedAreaChart[]> => {
	let result: IStackedAreaChart[] = [];
	try {
		result = await httpClient.getStackedDataByPeriod(period);
	} catch (error) {
		console.warn('[HelperProvider] fetchDataByPeriod: Erro ao buscar dados por periodo:', error);
	}
	return result;
};
