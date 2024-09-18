// src/components/ErosoesProvider.tsx

import { useState, useEffect, FC, ReactNode } from 'react';

import { ICity, ICountry, IState, IPercentualAreaChart, IStackedAreaChart } from '../../types';
import GetHttpClientErosoes from '../../http/GetHttpClientErosoes';
import GetHttpClientStates from '../../http/GetHttpClientStates';
import GetHttpClientCountries from '../../http/GetCountriesService';
import GetHttpClientCities from '../../http/GetHttpClientCities';
import { ErosoesContext } from './ErosoesContext';

export const ErosoesProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [contextStates, setContextStates] = useState<IState[]>([]);
    const [contextCountries, setContextCountries] = useState<ICountry[]>([]);
    const [contextCities, setContextCities] = useState<ICity[]>([]);

    const [contextStackedData, setContextStackedData] = useState<IStackedAreaChart[]>([]);
    const [contextPercentualData, setContextPercentualData] = useState<IPercentualAreaChart[]>([]);

    const getCountriesService = new GetHttpClientCountries<ICountry[]>();
    const getStatesService = new GetHttpClientStates<IState[]>();
    const getCitiesService = new GetHttpClientCities<ICity[]>();
    const getErosoesDataService = new GetHttpClientErosoes();

    const fetchData = async (): Promise<boolean> => {
        let result = false;
        try {
            const tmpCountriesData = await getCountriesService.getData();
            setContextCountries(tmpCountriesData);

            const tmpStatesData = await getStatesService.getData();
            setContextStates(tmpStatesData);

            const tmpCitiesData = await getCitiesService.getData();
            setContextCities(tmpCitiesData);

            const tmpStackedData = await getErosoesDataService.getStackedData();
            setContextStackedData(tmpStackedData);

            const tmpPercentualData = await getErosoesDataService.getPercentualData();
            setContextPercentualData(tmpPercentualData);

            result = true;
        } catch (error) {
            console.warn('[ErosoesProvider]: Erro ao buscar dados:', error);
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

    return <ErosoesContext.Provider value={value}>{children}</ErosoesContext.Provider>;
};
