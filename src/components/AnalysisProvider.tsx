// src/components/AnalysisProvider.tsx

import { useState, useEffect, FC, ReactNode } from 'react';
import { ICountry } from "./charts/ICountry";
import { IState } from "./charts/IState";
import { ICity } from "./charts/ICity";
import { IStackedAreaChart } from './charts/IStackedAreaChart';
import { IPercentualAreaChart } from './charts/IPercentualAreaChart';
import GetHttpClientStates from '../http/GetHttpClientStates';
import GetHttpClientCountries from '../http/GetCountriesService';
import GetHttpClientCities from '../http/GetHttpClientCities';
import { AnalysisContext } from './AnalysisContext';
import { buildUrl } from '../pages/AnalysisHelper';

export const AnalysisProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(true);

    const [states, setStates] = useState<IState[]>([]);
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);
    const [organicasStackedData, setAnalysisStackedData] = useState<IStackedAreaChart[]>([]);
    const [organicasPercentual, setAnalysisPercentual] = useState<IPercentualAreaChart[]>([]);

    const getCountriesService = new GetHttpClientCountries<ICountry[]>();
    const getStatesService = new GetHttpClientStates<IState[]>();
    const getCitiesService = new GetHttpClientCities<ICity[]>();

    const fetchRequiredData = async (): Promise<boolean> => {
        let result = false;
        try {
            const tmpCountriesData = await getCountriesService.getData();
            setCountries(tmpCountriesData);

            const tmpStatesData = await getStatesService.getData();
            setStates(tmpStatesData);

            const tmpCitiesData = await getCitiesService.getData();
            setCities(tmpCitiesData);

            // const tmpAnalysisStackedData = await getAnalysisService.getStackedData();
            // setAnalysisStackedData(tmpAnalysisStackedData);

            // const tmpAnalysisPercentualData = await getAnalysisService.getAnalysisAsPercentual();
            // setAnalysisPercentual(tmpAnalysisPercentualData);
            result = true;
        } catch (error) {
            console.error('[AnalysisProvider]: Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
        return result;
    };

    useEffect(() => {
        fetchRequiredData();
    }, []);


    const fetchSmaData = async (startDate: Date, endDate: Date, selectedAnalysis: string, interval: string): Promise<IStackedAreaChart[]> => {
        const startDateFormatted = startDate.toISOString().split('T')[0];
        const endDateFormatted = endDate.toISOString().split('T')[0];

        const url = `http://localhost:3001/sma/${interval}?analysis=${encodeURIComponent(
            selectedAnalysis,
        )}&startDate=${startDateFormatted}&endDate=${endDateFormatted}`;

        try {
            console.log(`[AnalysisProvider] fetchSmaData url: ${url}`);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Falha ao buscar os dados de Média Móvel');
            }
            const data: IStackedAreaChart[] = await response.json();
            console.log(`[AnalysisProvider] fetchSmaData result: ${JSON.stringify(data, null, 2)}`);
            return data;
        } catch (error) {
            console.error('Erro ao buscar os dados de Média Móvel:', error);
        }
        return [];
    };

    const fetchStackedData = async (startDate: Date, endDate: Date, analysis: string, interval: string, stateName: string, source: string, label: string): Promise<IStackedAreaChart[]> => {
        let result: IStackedAreaChart[] = []
        const url = buildUrl(startDate, endDate, analysis, interval, stateName, source, label);

        try {
            console.log(`[AnalysisProvider] fetchStackedData url: ${url}`);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Falha ao buscar os dados');

            result = await response.json();
            console.log(`[AnalysisProvider] fetchStackedData result: ${JSON.stringify(result, null, 2)}`);
        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
        }
        return result;
    };

    const fetchPercentageData = async (startDate: Date, endDate: Date, analysis: string, interval: string): Promise<IPercentualAreaChart[]> => {
        let result: IPercentualAreaChart[] = [];
        try {
            const startDateFormatted = startDate.toISOString().split('T')[0];
            const endDateFormatted = endDate.toISOString().split('T')[0];

            const url = `http://localhost:3001/percentage/${interval}?analysis=${encodeURIComponent(
                analysis,
            )}&startDate=${startDateFormatted}&endDate=${endDateFormatted}`;
            console.log(`[AnalysisProvider] fetchPercentageData url: ${url}`);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Falha ao buscar os dados de percentage');
            }
            const stackedData: IStackedAreaChart[] = await response.json();
            // Transformando de IStackedAreaChart para IPercentualAreaChart
            const percentualData: IPercentualAreaChart[] = stackedData.map((item) => ({
                period: item.period,
                value: parseFloat(item.entry[1].toString()), // Pega diretamente o valor de entry[1] como percentual
            }));
            result = percentualData;
            console.log(`[AnalysisProvider] fetchPercentageData result: ${JSON.stringify(result, null, 2)}`);
        } catch (error) {
            console.error('Erro ao buscar os dados de percentage:', error);
        }
        return result;
    };

    const value = {
        organicasStackedData,
        organicasPercentual,
        cities,
        states,
        countries,
        fetchRequiredData,
        fetchSmaData,
        fetchPercentageData,
        fetchStackedData,
    };

    return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
};
