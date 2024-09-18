// src/components/GEEProvider.tsx

import { useState, useEffect, FC, ReactNode } from 'react';

import { ICity, IState, ICountry } from '../charts/IStackedAreaChart';
import { IStackedAreaChart } from '../charts/IStackedAreaChart';
import { IPercentualAreaChart } from '../charts/IPercentualAreaChart';
import GetHttpClientGEE from '../../http/GetHttpClientGEE';
import GetHttpClientStates from '../../http/GetHttpClientStates';
import GetHttpClientCountries from '../../http/GetCountriesService';
import GetHttpClientCities from '../../http/GetHttpClientCities';
import { GEEContext } from './GEEContext';

export const GEEProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [contextStates, setContextStates] = useState<IState[]>([]);
    const [contextCountries, setContextCountries] = useState<ICountry[]>([]);
    const [contextCities, setContextCities] = useState<ICity[]>([]);

    const [contextStackedData, setContextStackedData] = useState<IStackedAreaChart[]>([]);
    const [contextPercentualData, setContextPercentualData] = useState<IPercentualAreaChart[]>([]);

    const getCountriesService = new GetHttpClientCountries<ICountry[]>();
    const getStatesService = new GetHttpClientStates<IState[]>();
    const getCitiesService = new GetHttpClientCities<ICity[]>();
    const getGEEDataService = new GetHttpClientGEE();

    const fetchData = async (): Promise<boolean> => {
        let result = false;
        try {
            const tmpCountriesData = await getCountriesService.getData();
            setContextCountries(tmpCountriesData);

            const tmpStatesData = await getStatesService.getData();
            setContextStates(tmpStatesData);

            const tmpCitiesData = await getCitiesService.getData();
            setContextCities(tmpCitiesData);

            const tmpStackedData = await getGEEDataService.getStackedData();
            setContextStackedData(tmpStackedData);

            const tmpPercentualData = await getGEEDataService.getPercentualData();
            setContextPercentualData(tmpPercentualData);

            result = true;
        } catch (error) {
            console.warn('[GEEProvider]: Erro ao buscar dados:', error);
        }
        return result;
    };

    useEffect(() => {
        fetchData();
    }, []);

    const value = {
        contextStackedData,
        contextPercentualData,
        contextCities,
        contextStates,
        contextCountries,
        fetchData,
    };

    return <GEEContext.Provider value={value}>{children}</GEEContext.Provider>;
};
