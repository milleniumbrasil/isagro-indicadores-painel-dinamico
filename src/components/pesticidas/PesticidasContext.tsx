// src/components/PesticidasContext.tsx

import { createContext, useContext } from 'react';
import { ICountry } from "../charts/ICountry";
import { IState } from "../charts/IState";
import { ICity } from "../charts/ICity";
import { IStackedAreaChart } from '../charts/IStackedAreaChart';
import { IPercentualAreaChart } from '../charts/IPercentualAreaChart';

// Interface para o contexto
export interface PesticidasContextProps {
    contextStackedData?: IStackedAreaChart[];
    contextPercentualData?: IPercentualAreaChart[];
    contextCities: ICity[];
    contextStates: IState[];
    contextCountries: ICountry[];
    fetchData: () => Promise<boolean>;
}

// Criação do contexto
export const PesticidasContext = createContext<PesticidasContextProps>({
    contextStackedData: [],
    contextPercentualData: [],
    contextCities: [],
    contextStates: [],
    contextCountries: [],
    fetchData: () => Promise.resolve(false),
});

// Hook para utilizar o contexto
export const usePesticidasContext = () => {
    const context = useContext(PesticidasContext);
    if (!context) {
        console.warn('[PesticidasContext]: deve ser usado dentro de um PesticidasProvider');
    }
    if (!context.contextCountries || context.contextCountries.length === 0) {
        console.warn('[PesticidasContext]: countries is required');
    } else console.log('[PesticidasContext]: countries loaded: ', context.contextCountries.length);
    if (!context.contextStates || context.contextStates.length === 0) {
        console.warn('[PesticidasContext]: states is required');
    } else console.log('[PesticidasContext]: states loaded: ', context.contextStates.length);
    if (!context.contextCities || context.contextCities.length === 0) {
        console.warn('[PesticidasContext]: cities is required');
    } else console.log('[PesticidasContext]: cities loaded: ', context.contextCities.length);
    if (!context.contextStackedData || context.contextStackedData.length === 0) {
        console.warn('[PesticidasContext]: contextStackedData is required');
    } else console.log('[PesticidasContext]: contextStackedData loaded: ', context.contextStackedData.length);
    if (!context.contextPercentualData || context.contextPercentualData.length === 0) {
        console.warn('[PesticidasContext]: contextPercentualData is required');
    } else console.log('[PesticidasContext]: contextPercentualData loaded: ', context.contextPercentualData.length);
    return context;
};
