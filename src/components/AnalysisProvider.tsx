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

    const fetchData = async (): Promise<boolean> => {
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
        fetchData();
    }, []);

    const value = {
        organicasStackedData,
        organicasPercentual,
        cities,
        states,
        countries,
        fetchData,
    };

    return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
};
