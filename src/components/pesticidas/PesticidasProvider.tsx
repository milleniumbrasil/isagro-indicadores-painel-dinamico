// src/components/PesticidasProvider.tsx

import { useState, useEffect, FC, ReactNode } from 'react';

import { ICountry } from "../charts/ICountry";
import { IState } from "../charts/IState";
import { ICity } from "../charts/ICity";
import { IStackedAreaChart } from '../charts/IStackedAreaChart';
import { IPercentualAreaChart } from '../charts/IPercentualAreaChart';
import GetHttpClientPesticidas from '../../http/GetHttpClientPesticidas';
import GetHttpClientStates from '../../http/GetHttpClientStates';
import GetHttpClientCountries from '../../http/GetCountriesService';
import GetHttpClientCities from '../../http/GetHttpClientCities';
import { PesticidasContext } from './PesticidasContext';

export const PesticidasProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [contextStates, setContextStates] = useState<IState[]>([]);
    const [contextCountries, setContextCountries] = useState<ICountry[]>([]);
    const [contextCities, setContextCities] = useState<ICity[]>([]);

    const [contextStackedData, setContextStackedData] = useState<IStackedAreaChart[]>([]);
    const [contextPercentualData, setContextPercentualData] = useState<IPercentualAreaChart[]>([]);

    const getCountriesService = new GetHttpClientCountries<ICountry[]>();
    const getStatesService = new GetHttpClientStates<IState[]>();
    const getCitiesService = new GetHttpClientCities<ICity[]>();
    const getPesticidasDataService = new GetHttpClientPesticidas();

    const fetchData = async (): Promise<boolean> => {
        let result = false;
        try {
            const tmpCountriesData = await getCountriesService.getData();
            setContextCountries(tmpCountriesData);

            const tmpStatesData = await getStatesService.getData();
            setContextStates(tmpStatesData);

            const tmpCitiesData = await getCitiesService.getData();
            setContextCities(tmpCitiesData);

            const tmpStackedData = await getPesticidasDataService.getStackedData();
            setContextStackedData(tmpStackedData);

            const tmpPercentualData = await getPesticidasDataService.getPercentualData();
            setContextPercentualData(tmpPercentualData);

            result = true;
        } catch (error) {
            console.warn('[PesticidasProvider]: Erro ao buscar dados:', error);
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

    return <PesticidasContext.Provider value={value}>{children}</PesticidasContext.Provider>;
};
