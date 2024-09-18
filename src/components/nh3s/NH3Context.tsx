// src/components/NH3Context.tsx

import { createContext, useContext } from 'react';
import { ICountry } from "../charts/ICountry";
import { IState } from "../charts/IState";
import { ICity } from "../charts/ICity";
import { IStackedAreaChart } from '../charts/IStackedAreaChart';
import { IPercentualAreaChart } from '../charts/IPercentualAreaChart';

// Interface para o contexto
export interface NH3ContextProps {
    contextStackedData?: IStackedAreaChart[];
    contextPercentualData?: IPercentualAreaChart[];
    contextCities: ICity[];
    contextStates: IState[];
    contextCountries: ICountry[];
    fetchData: () => Promise<boolean>;
}

// Criação do contexto
export const NH3Context = createContext<NH3ContextProps>({
    contextStackedData: [],
    contextPercentualData: [],
    contextCities: [],
    contextStates: [],
    contextCountries: [],
    fetchData: () => Promise.resolve(false),
});

// Hook para utilizar o contexto
export const useNH3Context = () => {
    const context = useContext(NH3Context);
    if (!context) {
        console.warn('[NH3Context]: deve ser usado dentro de um NH3Provider');
    }
    if (!context.contextCountries || context.contextCountries.length === 0) {
        console.warn('[NH3Context]: countries is required');
    } else console.log('[NH3Context]: countries loaded: ', context.contextCountries.length);
    if (!context.contextStates || context.contextStates.length === 0) {
        console.warn('[NH3Context]: states is required');
    } else console.log('[NH3Context]: states loaded: ', context.contextStates.length);
    if (!context.contextCities || context.contextCities.length === 0) {
        console.warn('[NH3Context]: cities is required');
    } else console.log('[NH3Context]: cities loaded: ', context.contextCities.length);
    if (!context.contextStackedData || context.contextStackedData.length === 0) {
        console.warn('[NH3Context]: contextStackedData is required');
    } else console.log('[NH3Context]: contextStackedData loaded: ', context.contextStackedData.length);
    if (!context.contextPercentualData || context.contextPercentualData.length === 0) {
        console.warn('[NH3Context]: contextPercentualData is required');
    } else console.log('[NH3Context]: contextPercentualData loaded: ', context.contextPercentualData.length);
    return context;
};
