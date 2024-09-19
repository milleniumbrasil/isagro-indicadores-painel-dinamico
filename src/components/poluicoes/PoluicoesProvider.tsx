// src/components/PoluicoesProvider.tsx

import { useState, useEffect, FC, ReactNode } from 'react';

import { ICountry } from "../charts/ICountry";
import { IState } from "../charts/IState";
import { ICity } from "../charts/ICity";
import { IStackedAreaChart } from '../charts/IStackedAreaChart';
import { IPercentualAreaChart } from '../charts/IPercentualAreaChart';
import GetHttpClientPoluicoes from '../../http/GetHttpClientPoluicoes';
import GetHttpClientStates from '../../http/GetHttpClientStates';
import GetHttpClientCountries from '../../http/GetCountriesService';
import GetHttpClientCities from '../../http/GetHttpClientCities';
import { PoluicoesContext } from './PoluicoesContext';

export const PoluicoesProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [contextStates, setContextStates] = useState<IState[]>([]);
    const [contextCountries, setContextCountries] = useState<ICountry[]>([]);
    const [contextCities, setContextCities] = useState<ICity[]>([]);
    const [contextStartDate, setContextStartDate] = useState<Date>(new Date());
    const [contextEndDate, setContextEndDate] = useState<Date>(new Date());

    const [contextStackedData, setContextStackedData] = useState<IStackedAreaChart[]>([]);
    const [contextPercentualData, setContextPercentualData] = useState<IPercentualAreaChart[]>([]);

    const getCountriesService = new GetHttpClientCountries<ICountry[]>();
    const getStatesService = new GetHttpClientStates<IState[]>();
    const getCitiesService = new GetHttpClientCities<ICity[]>();
    const getPoluicoesDataService = new GetHttpClientPoluicoes();

    const initializeStackedDataPeriods = (_stackedData: IStackedAreaChart[]) => {
        if (_stackedData.length === 0) {
            return;
        }

        const dates = _stackedData.map(data => new Date(data.period));

        const startDate = new Date(Math.min(...dates.map(date => date.getTime())));
        const endDate = new Date(Math.max(...dates.map(date => date.getTime())));

        setContextStartDate(startDate);
        setContextEndDate(endDate);
    }

    const fetchData = async (): Promise<boolean> => {
        let result = false;
        try {
            const tmpCountriesData = await getCountriesService.getData();
            setContextCountries(tmpCountriesData);

            const tmpStatesData = await getStatesService.getData();
            setContextStates(tmpStatesData);

            const tmpCitiesData = await getCitiesService.getData();
            setContextCities(tmpCitiesData);

            const tmpStackedData = await getPoluicoesDataService.getStackedData();
            setContextStackedData(tmpStackedData);
            initializeStackedDataPeriods(tmpStackedData);

            const tmpPercentualData = await getPoluicoesDataService.getPercentualData();
            setContextPercentualData(tmpPercentualData);

            result = true;
        } catch (error) {
            console.warn('[PoluicoesProvider]: Erro ao buscar dados:', error);
        }
        return result;
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchDataByPeriod = async (period: string): Promise<boolean> => {
        let result = false;
        try {
            const tmpStackedDataByPeriod = await getPoluicoesDataService.getStackedDataByPeriod(period);
            setContextStackedData(tmpStackedDataByPeriod);
            result = true;
        } catch (error) {
            console.warn('[PoluicoesProvider]: Erro ao buscar dados por periodo:', error);
        }
        return result;
    };

    useEffect(() => {
        setContextStartDate(contextStartDate);
        setContextEndDate(contextEndDate);
        // Monta o período no formato "YYYY-YYYY"
        const period = `${contextStartDate.getFullYear().toString()}-${contextEndDate.getFullYear().toString()}`;
        fetchDataByPeriod(period);
    }, [setContextStartDate, setContextStartDate]);

    const value = {
        contextStackedData,
        contextPercentualData,
        contextCities,
        contextStates,
        contextCountries,
        contextStartDate,
        contextEndDate,
        setContextStartDate,
        setContextEndDate,
        fetchData,
    };

    return <PoluicoesContext.Provider value={value}>{children}</PoluicoesContext.Provider>;
};
