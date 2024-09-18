// src/components/PoluicoesContext.tsx

import { createContext, useContext } from 'react';
import { IStackedAreaChart, IPercentualAreaChart, ICity, IState, ICountry } from '../types';

// Interface para o contexto
export interface PoluicoesContextProps {
    contextStackedData?: IStackedAreaChart[];
    contextPercentualData?: IPercentualAreaChart[];
    contextCities: ICity[];
    contextStates: IState[];
    contextCountries: ICountry[];
    fetchData: () => Promise<boolean>;
}

// Criação do contexto
export const PoluicoesContext = createContext<PoluicoesContextProps>({
    contextStackedData: [],
    contextPercentualData: [],
    contextCities: [],
    contextStates: [],
    contextCountries: [],
    fetchData: () => Promise.resolve(false),
});

// Hook para utilizar o contexto
export const usePoluicoesContext = () => {
    const context = useContext(PoluicoesContext);
    if (!context) {
        console.warn('[PoluicoesContext]: deve ser usado dentro de um PoluicoesProvider');
    }
    if (!context.contextCountries || context.contextCountries.length === 0) {
        console.warn('[PoluicoesContext]: countries is required');
    } else console.log('[PoluicoesContext]: countries loaded: ', context.contextCountries.length);
    if (!context.contextStates || context.contextStates.length === 0) {
        console.warn('[PoluicoesContext]: states is required');
    } else console.log('[PoluicoesContext]: states loaded: ', context.contextStates.length);
    if (!context.contextCities || context.contextCities.length === 0) {
        console.warn('[PoluicoesContext]: cities is required');
    } else console.log('[PoluicoesContext]: cities loaded: ', context.contextCities.length);
    if (!context.contextStackedData || context.contextStackedData.length === 0) {
        console.warn('[PoluicoesContext]: contextStackedData is required');
    } else console.log('[PoluicoesContext]: contextStackedData loaded: ', context.contextStackedData.length);
    if (!context.contextPercentualData || context.contextPercentualData.length === 0) {
        console.warn('[PoluicoesContext]: contextPercentualData is required');
    } else console.log('[PoluicoesContext]: contextPercentualData loaded: ', context.contextPercentualData.length);
    return context;
};
