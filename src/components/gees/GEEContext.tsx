// src/components/GEEContext.tsx

import { createContext, useContext } from 'react';
import { ICity, IState, ICountry } from '../charts/types';
import { IStackedAreaChart } from '../charts/types';
import { IPercentualAreaChart } from '../charts/IPercentualAreaChart';

// Interface para o contexto
export interface GEEContextProps {
    contextStackedData?: IStackedAreaChart[];
    contextPercentualData?: IPercentualAreaChart[];
    contextCities: ICity[];
    contextStates: IState[];
    contextCountries: ICountry[];
    fetchData: () => Promise<boolean>;
}

// Criação do contexto
export const GEEContext = createContext<GEEContextProps>({
    contextStackedData: [],
    contextPercentualData: [],
    contextCities: [],
    contextStates: [],
    contextCountries: [],
    fetchData: () => Promise.resolve(false),
});

// Hook para utilizar o contexto
export const useGEEContext = () => {
    const context = useContext(GEEContext);
    if (!context) {
        console.warn('[GEEContext]: deve ser usado dentro de um GEEProvider');
    }
    if (!context.contextCountries || context.contextCountries.length === 0) {
        console.warn('[GEEContext]: countries is required');
    } else console.log('[GEEContext]: countries loaded: ', context.contextCountries.length);
    if (!context.contextStates || context.contextStates.length === 0) {
        console.warn('[GEEContext]: states is required');
    } else console.log('[GEEContext]: states loaded: ', context.contextStates.length);
    if (!context.contextCities || context.contextCities.length === 0) {
        console.warn('[GEEContext]: cities is required');
    } else console.log('[GEEContext]: cities loaded: ', context.contextCities.length);
    if (!context.contextStackedData || context.contextStackedData.length === 0) {
        console.warn('[GEEContext]: contextStackedData is required');
    } else console.log('[GEEContext]: contextStackedData loaded: ', context.contextStackedData.length);
    if (!context.contextPercentualData || context.contextPercentualData.length === 0) {
        console.warn('[GEEContext]: contextPercentualData is required');
    } else console.log('[GEEContext]: contextPercentualData loaded: ', context.contextPercentualData.length);
    return context;
};
