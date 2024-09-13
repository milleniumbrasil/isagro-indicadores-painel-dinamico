// src/components/ISAgroContext.tsx

import { createContext, useContext } from 'react';
import { IStackedAreaChart, IPercentualAreaChart, ICity, IState, ICountry } from '../types';

// Interface para o contexto
export interface ISAgroContextProps {
    geeStackedData?: IStackedAreaChart[];
    nh3StackedData?: IStackedAreaChart[];
    npkStackedData?: IStackedAreaChart[];
    organicasStackedData: IStackedAreaChart[];
    organicasPercentual?: IPercentualAreaChart[];
    poluicaoStackedData?: IStackedAreaChart[];
    erosaoStackedData?: IStackedAreaChart[];
    cities: ICity[];
    states: IState[];
    countries: ICountry[];
    fetchData: () => Promise<Boolean>;
}

// Criação do contexto
export const ISAgroContext = createContext<ISAgroContextProps>({
    geeStackedData: [],
    nh3StackedData: [],
    npkStackedData: [],
    organicasStackedData: [],
    organicasPercentual: [],
    poluicaoStackedData: [],
    erosaoStackedData: [],
    cities: [],
    states: [],
    countries: [],
    fetchData: () => Promise.resolve(false),
});

// Hook para utilizar o contexto
export const useISAgroContext = () => {
    const context = useContext(ISAgroContext);
    if (!context) {
        throw new Error('useISAgroContext deve ser usado dentro de um ISAgroProvider');
    }
    if (!context.countries || context.countries.length === 0) {
        throw new Error('useISAgroContext: countries is required');
    }
    if (!context.states || context.states.length === 0) {
        throw new Error('useISAgroContext: states is required');
    }
    if (!context.cities || context.cities.length === 0) {
        throw new Error('useISAgroContext: cities is required');
    }
    if (!context.erosaoStackedData || context.erosaoStackedData.length === 0) {
        throw new Error('useISAgroContext: erosaoStackedData is required');
    }
    if (!context.geeStackedData || context.geeStackedData.length === 0) {
        throw new Error('useISAgroContext: geeStackedData is required');
    }
    if (!context.nh3StackedData || context.nh3StackedData.length === 0) {
        throw new Error('useISAgroContext: nh3StackedData is required');
    }
    if (!context.npkStackedData || context.npkStackedData.length === 0) {
        throw new Error('useISAgroContext: npkStackedData is required');
    }
    if (!context.organicasStackedData || context.organicasStackedData.length === 0) {
        throw new Error('useISAgroContext: organicasStackedData is required');
    }
    if (!context.poluicaoStackedData || context.poluicaoStackedData.length === 0) {
        throw new Error('useISAgroContext: poluicaoStackedData is required');
    }
    return context;
};
