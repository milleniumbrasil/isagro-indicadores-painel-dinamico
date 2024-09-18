// src/components/NH3Context.tsx

import { createContext, useContext } from 'react';
import { IStackedAreaChart, IPercentualAreaChart, ICity, IState, ICountry } from '../types';

// Interface para o contexto
export interface NH3ContextProps {
    nh3StackedData?: IStackedAreaChart[];
    nh3StackedPercentual?: IPercentualAreaChart[];
    cities: ICity[];
    contextStates: IState[];
    contextCountries: ICountry[];
    fetchData: () => Promise<boolean>;
}

// Criação do contexto
export const NH3Context = createContext<NH3ContextProps>({
    nh3StackedData: [],
    nh3StackedPercentual: [],
    cities: [],
    contextStates: [],
    contextCountries: [],
    fetchData: () => Promise.resolve(false),
});

// Hook para utilizar o contexto
export const useNH3Context = () => {
    const context = useContext(NH3Context);
    if (!context) {
        console.warn('useNH3Context deve ser usado dentro de um NH3Provider');
    }
    if (!context.contextCountries || context.contextCountries.length === 0) {
        console.warn('useNH3Context: countries is required');
    }
    if (!context.contextStates || context.contextStates.length === 0) {
        console.warn('useNH3Context: states is required');
    }
    if (!context.cities || context.cities.length === 0) {
        console.warn('useNH3Context: cities is required');
    }
    return context;
};
