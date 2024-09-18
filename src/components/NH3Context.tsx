// src/components/NH3Context.tsx

import { createContext, useContext } from 'react';
import { IStackedAreaChart, IPercentualAreaChart, ICity, IState, ICountry } from '../types';

// Interface para o contexto
export interface NH3ContextProps {
    contextNh3StackedData?: IStackedAreaChart[];
    contextNh3StackedPercentual?: IPercentualAreaChart[];
    contextCities: ICity[];
    contextStates: IState[];
    contextCountries: ICountry[];
    fetchData: () => Promise<boolean>;
}

// Criação do contexto
export const NH3Context = createContext<NH3ContextProps>({
    contextNh3StackedData: [],
    contextNh3StackedPercentual: [],
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
    }
    if (!context.contextStates || context.contextStates.length === 0) {
        console.warn('[NH3Context]: states is required');
    }
    if (!context.contextCities || context.contextCities.length === 0) {
        console.warn('[NH3Context]: cities is required');
    }
    if (!context.contextNh3StackedData || context.contextNh3StackedData.length === 0) {
        console.warn('[NH3Context]: contextNh3StackedData is required');
    }
    if (!context.contextNh3StackedPercentual || context.contextNh3StackedPercentual.length === 0) {
        console.warn('[NH3Context]: contextNh3StackedPercentual is required');
    }
    return context;
};
