// src/components/NPKContext.tsx

import { createContext, useContext } from 'react';
import { ICity, IState, ICountry } from '../charts/IStackedAreaChart';
import { IStackedAreaChart } from '../charts/IStackedAreaChart';
import { IPercentualAreaChart } from '../charts/IPercentualAreaChart';

// Interface para o contexto
export interface NPKContextProps {
    npkStackedData?: IStackedAreaChart[];
    npkPercentual?: IPercentualAreaChart[];
    cities: ICity[];
    states: IState[];
    countries: ICountry[];
    fetchData: () => Promise<boolean>;
}

// Criação do contexto
export const NPKContext = createContext<NPKContextProps>({
    npkStackedData: [],
    npkPercentual: [],
    cities: [],
    states: [],
    countries: [],
    fetchData: () => Promise.resolve(false),
});

// Hook para utilizar o contexto
export const useNPKContext = () => {
    const context = useContext(NPKContext);
    if (!context) {
        console.warn('useNPKContext deve ser usado dentro de um NPKProvider');
    }
    if (!context.countries || context.countries.length === 0) {
        console.warn('useNPKContext: countries is required');
    }
    if (!context.states || context.states.length === 0) {
        console.warn('useNPKContext: states is required');
    }
    if (!context.cities || context.cities.length === 0) {
        console.warn('useNPKContext: cities is required');
    }
    if (!context.npkStackedData || context.npkStackedData.length === 0) {
        console.warn('useNPKContext: npkStackedData is required');
    }
    return context;
};