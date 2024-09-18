// src/components/NH3Provider.tsx

import { useState, useEffect, FC, ReactNode } from 'react';

import { ICity, ICountry, IState, IPercentualAreaChart, IStackedAreaChart } from '../types';
import GetHttpClientNH3 from '../http/GetHttpClientNH3';
import GetHttpClientStates from '../http/GetHttpClientStates';
import GetHttpClientCountries from '../http/GetCountriesService';
import GetHttpClientCities from '../http/GetHttpClientCities';
import { NH3Context } from './NH3Context';

export const NH3Provider: FC<{ children: ReactNode }> = ({ children }) => {

    const [loading, setLoading] = useState(true);

    const [contextStates, setContextStates] = useState<IState[]>([]);
    const [contextCountries, setContextCountries] = useState<ICountry[]>([]);
    const [contextCities, setContextCities] = useState<ICity[]>([]);

    const [contextStackedData, setContextStackedData] = useState<IStackedAreaChart[]>([]);
    const [contextPercentualData, setContextPercentualData] = useState<IPercentualAreaChart[]>([]);

    const getCountriesService = new GetHttpClientCountries<ICountry[]>();
    const getStatesService = new GetHttpClientStates<IState[]>();
    const getCitiesService = new GetHttpClientCities<ICity[]>();
    const getNH3DataService = new GetHttpClientNH3();

    const fetchData = async (): Promise<boolean> => {
        let result = false;
        try {
            const tmpCountriesData = await getCountriesService.getData();
            setContextCountries(tmpCountriesData);

            const tmpStatesData = await getStatesService.getData();
            setContextStates(tmpStatesData);

            const tmpCitiesData = await getCitiesService.getData();
            setContextCities(tmpCitiesData);

            const tmpStackedData = await getNH3DataService.getStackedData();
            setContextStackedData(tmpStackedData);

            const tmpPercentualData = await getNH3DataService.getPercentualData();
            setContextPercentualData(tmpPercentualData);

            result = true;
        } catch (error) {
            console.warn('[NH3Provider]: Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
        return result;
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div>Providers carregando...</div>; // Um estado de carregamento enquanto os dados são obtidos
    }

    const value = {
        contextStackedData,
        contextPercentualData,
        contextCities,
        contextStates,
        contextCountries,
        fetchData,
    };

    return <NH3Context.Provider value={value}>{children}</NH3Context.Provider>;
};
