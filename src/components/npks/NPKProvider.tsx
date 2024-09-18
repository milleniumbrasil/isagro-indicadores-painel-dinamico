// src/components/NPKProvider.tsx

import { useState, useEffect, FC, ReactNode } from 'react';

import { ICity, IState, ICountry } from '../charts/IStackedAreaChart';
import { IStackedAreaChart } from '../charts/IStackedAreaChart';
import { IPercentualAreaChart } from '../charts/IPercentualAreaChart';
import GetHttpClientNPK from '../../http/GetHttpClientNPK';
import GetHttpClientStates from '../../http/GetHttpClientStates';
import GetHttpClientCountries from '../../http/GetCountriesService';
import GetHttpClientCities from '../../http/GetHttpClientCities';
import { NPKContext } from './NPKContext';

export const NPKProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(true);

    const [states, setStates] = useState<IState[]>([]);
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);
    const [npkStackedData, setNpkStackedData] = useState<IStackedAreaChart[]>([]);
    const [npkPercentual, setNpkPercentual] = useState<IPercentualAreaChart[]>([]);

    const getCountriesService = new GetHttpClientCountries<ICountry[]>();
    const getStatesService = new GetHttpClientStates<IState[]>();
    const getCitiesService = new GetHttpClientCities<ICity[]>();
    const getNPKDataService = new GetHttpClientNPK();

    const fetchData = async (): Promise<boolean> => {
        let result = false;
        try {
            const tmpCountriesData = await getCountriesService.getData();
            setCountries(tmpCountriesData);

            const tmpStatesData = await getStatesService.getData();
            setStates(tmpStatesData);

            const tmpCitiesData = await getCitiesService.getData();
            setCities(tmpCitiesData);

            const tmpNPKStackedData = await getNPKDataService.getStackedData();
            setNpkStackedData(tmpNPKStackedData);

            const tmpNpkPercentualData = await getNPKDataService.getPercentualData();
            setNpkPercentual(tmpNpkPercentualData);

            result = true;
        } catch (error) {
            console.error('[NPKProvider]: Erro ao buscar dados:', error);
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
        npkStackedData,
        npkPercentual,
        cities,
        states,
        countries,
        fetchData,
    };

    return <NPKContext.Provider value={value}>{children}</NPKContext.Provider>;
};
