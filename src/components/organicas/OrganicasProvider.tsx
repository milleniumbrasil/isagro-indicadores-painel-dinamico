// src/components/OrganicasProvider.tsx

import { useState, useEffect, FC, ReactNode } from 'react';
import { ICity, ICountry, IState, IPercentualAreaChart, IStackedAreaChart } from '../../types';
import GetHttpClientStates from '../../http/GetHttpClientStates';
import GetHttpClientCountries from '../../http/GetCountriesService';
import GetHttpClientCities from '../../http/GetHttpClientCities';
import GetHttpClientOrganicas from '../../http/GetHttpClientOrganicas';
import { OrganicasContext } from './OrganicasContext';

export const OrganicasProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(true);

    const [states, setStates] = useState<IState[]>([]);
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);
    const [organicasStackedData, setOrganicasStackedData] = useState<IStackedAreaChart[]>([]);
    const [organicasPercentual, setOrganicasPercentual] = useState<IPercentualAreaChart[]>([]);

    const getCountriesService = new GetHttpClientCountries<ICountry[]>();
    const getStatesService = new GetHttpClientStates<IState[]>();
    const getCitiesService = new GetHttpClientCities<ICity[]>();
    const getOrganicasService = new GetHttpClientOrganicas();

    const fetchData = async (): Promise<boolean> => {
        let result = false;
        try {
            const tmpCountriesData = await getCountriesService.getData();
            setCountries(tmpCountriesData);

            const tmpStatesData = await getStatesService.getData();
            setStates(tmpStatesData);

            const tmpCitiesData = await getCitiesService.getData();
            setCities(tmpCitiesData);

            const tmpOrganicasStackedData = await getOrganicasService.getStackedData();
            setOrganicasStackedData(tmpOrganicasStackedData);

            const tmpOrganicasPercentualData = await getOrganicasService.getOrganicasAsPercentual();
            setOrganicasPercentual(tmpOrganicasPercentualData);
            result = true;
        } catch (error) {
            console.error('[OrganicasProvider]: Erro ao buscar dados:', error);
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
        organicasStackedData,
        organicasPercentual,
        cities,
        states,
        countries,
        fetchData,
    };

    return <OrganicasContext.Provider value={value}>{children}</OrganicasContext.Provider>;
};
