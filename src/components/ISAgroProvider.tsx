// src/components/ISAgroProvider.tsx

import { useState, useEffect, FC, ReactNode } from 'react';
import GetHttpClientNPK from '../http/GetHttpClientNPK';
import GetHttpClientStates from '../http/GetHttpClientStates';
import GetHttpClientCountries from '../http/GetCountriesService';
import GetHttpClientCities from '../http/GetHttpClientCities';
import GetHttpClientOrganicas from '../http/GetHttpClientOrganicas';
import GetHttpClientErosoes from '../http/GetHttpClientErosoes';
import GetHttpClientGEE from '../http/GetHttpClientGEE';
import GetHttpClientNH3 from '../http/GetHttpClientNH3';
import GetHttpClientPoluicao from '../http/GetHttpClientPoluicao';
import { ICity, ICountry, IState, IPercentualAreaChart, IStackedAreaChart } from '../types';
import { ISAgroContext } from './ISAgroContext';

export const ISAgroProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(true);

    const [states, setStates] = useState<IState[]>([]);
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);

    const [erosaoStackedData, setErosaoStackedData] = useState<IStackedAreaChart[]>([]);
    const [geeStackedData, setGeeStackedData] = useState<IStackedAreaChart[]>([]);
    const [nh3StackedData, setNh3StackedData] = useState<IStackedAreaChart[]>([]);
    const [npkStackedData, setNpkStackedData] = useState<IStackedAreaChart[]>([]);
    const [npkPercentual, setNpkPercentual] = useState<IPercentualAreaChart[]>([]);
    const [organicasStackedData, setOrganicasStackedData] = useState<IStackedAreaChart[]>([]);
    const [poluicaoStackedData, setPoluicaoStackedData] = useState<IStackedAreaChart[]>([]);

    const [organicasPercentual, setOrganicasPercentual] = useState<IPercentualAreaChart[]>([]);

    const getCountriesService = new GetHttpClientCountries<ICountry[]>();
    const getStatesService = new GetHttpClientStates<IState[]>();
    const getCitiesService = new GetHttpClientCities<ICity[]>();

    const getErosaoDataService = new GetHttpClientErosoes();
    const getGEEDataService = new GetHttpClientGEE();
    const getNH3DataService = new GetHttpClientNH3();
    const getNPKDataService = new GetHttpClientNPK();
    const getOrganicasService = new GetHttpClientOrganicas();
    const getPoluicaoDataService = new GetHttpClientPoluicao();

    const fetchData = async (): Promise<boolean> => {
        let result = false;
        try {
            const tmpCountriesData = await getCountriesService.getData();
            setCountries(tmpCountriesData);

            const tmpStatesData = await getStatesService.getData();
            setStates(tmpStatesData);

            const tmpCitiesData = await getCitiesService.getData();
            setCities(tmpCitiesData);

            // const tmpErosaoStackedData = await getErosaoDataService.getStackedData();
            // setErosaoStackedData(tmpErosaoStackedData);

            // const tmpGEEStackedData = await getGEEDataService.getStackedData();
            // setGeeStackedData(tmpGEEStackedData);

            // const tmpNH3StackedData = await getNH3DataService.getStackedData();
            // setNh3StackedData(tmpNH3StackedData);

            const tmpNPKStackedData = await getNPKDataService.getStackedData();
            setNpkStackedData(tmpNPKStackedData);

            const tmpNpkPercentualData = await getNPKDataService.getPercentualData();
            setNpkPercentual(tmpNpkPercentualData);

            const tmpOrganicasStackedData = await getOrganicasService.getStackedData();
            setOrganicasStackedData(tmpOrganicasStackedData);

            const tmpOrganicasPercentualData = await getOrganicasService.getOrganicasAsPercentual();
            setOrganicasPercentual(tmpOrganicasPercentualData);

            // const tmpPoluicaoStackedData = await getPoluicaoDataService.getStackedData();
            // setPoluicaoStackedData(tmpPoluicaoStackedData);
            result = true;
        } catch (error) {
            console.error('[ISAgroProvider]: Erro ao buscar dados:', error);
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
        geeStackedData,
        nh3StackedData,
        npkStackedData,
        npkPercentual,
        organicasStackedData,
        organicasPercentual,
        poluicaoStackedData,
        erosaoStackedData,
        cities,
        states,
        countries,
        fetchData,
    };

    return <ISAgroContext.Provider value={value}>{children}</ISAgroContext.Provider>;
};
