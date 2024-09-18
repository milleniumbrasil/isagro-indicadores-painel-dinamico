// src/components/OrganicasContext.tsx

import { createContext, useContext } from 'react';
import { IStackedAreaChart, IPercentualAreaChart, ICity, IState, ICountry } from '../types';

// Interface para o contexto
export interface OrganicasContextProps {
    organicasStackedData: IStackedAreaChart[];
    organicasPercentual?: IPercentualAreaChart[];
    poluicaoStackedData?: IStackedAreaChart[];
    cities: ICity[];
    states: IState[];
    countries: ICountry[];
    fetchData: () => Promise<boolean>;
}

// Criação do contexto
export const OrganicasContext = createContext<OrganicasContextProps>({
    organicasStackedData: [],
    organicasPercentual: [],
    cities: [],
    states: [],
    countries: [],
    fetchData: () => Promise.resolve(false),
});

// Hook para utilizar o contexto
export const useOrganicasContext = () => {
    const context = useContext(OrganicasContext);
    if (!context) {
        throw new Error('useOrganicasContext deve ser usado dentro de um OrganicasProvider');
    }
    if (!context.countries || context.countries.length === 0) {
        throw new Error('useOrganicasContext: countries is required');
    }
    if (!context.states || context.states.length === 0) {
        throw new Error('useOrganicasContext: states is required');
    }
    if (!context.cities || context.cities.length === 0) {
        throw new Error('useOrganicasContext: cities is required');
    }
    if (!context.organicasStackedData || context.organicasStackedData.length === 0) {
        throw new Error('useOrganicasContext: organicasStackedData is required');
    }
    return context;
};
