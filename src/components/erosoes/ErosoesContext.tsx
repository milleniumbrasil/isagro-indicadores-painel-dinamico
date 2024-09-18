// src/components/ErosoesContext.tsx

import { createContext, useContext } from 'react';
import { IStackedAreaChart, IPercentualAreaChart, ICity, IState, ICountry } from '../../types';

// Interface para o contexto
export interface ErosoesContextProps {
    contextStackedData?: IStackedAreaChart[];
    contextPercentualData?: IPercentualAreaChart[];
    contextCities: ICity[];
    contextStates: IState[];
    contextCountries: ICountry[];
    fetchData: () => Promise<boolean>;
}

// Criação do contexto
export const ErosoesContext = createContext<ErosoesContextProps>({
    contextStackedData: [],
    contextPercentualData: [],
    contextCities: [],
    contextStates: [],
    contextCountries: [],
    fetchData: () => Promise.resolve(false),
});

// Hook para utilizar o contexto
export const useErosoesContext = () => {
    const context = useContext(ErosoesContext);
    if (!context) {
        console.warn('[ErosoesContext]: deve ser usado dentro de um ErosoesProvider');
    }
    if (!context.contextCountries || context.contextCountries.length === 0) {
        console.warn('[ErosoesContext]: countries is required');
    } else console.log('[ErosoesContext]: countries loaded: ', context.contextCountries.length);
    if (!context.contextStates || context.contextStates.length === 0) {
        console.warn('[ErosoesContext]: states is required');
    } else console.log('[ErosoesContext]: states loaded: ', context.contextStates.length);
    if (!context.contextCities || context.contextCities.length === 0) {
        console.warn('[ErosoesContext]: cities is required');
    } else console.log('[ErosoesContext]: cities loaded: ', context.contextCities.length);
    if (!context.contextStackedData || context.contextStackedData.length === 0) {
        console.warn('[ErosoesContext]: contextStackedData is required');
    } else console.log('[ErosoesContext]: contextStackedData loaded: ', context.contextStackedData.length);
    if (!context.contextPercentualData || context.contextPercentualData.length === 0) {
        console.warn('[ErosoesContext]: contextPercentualData is required');
    } else console.log('[ErosoesContext]: contextPercentualData loaded: ', context.contextPercentualData.length);
    return context;
};
