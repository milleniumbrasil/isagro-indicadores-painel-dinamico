

// src/components/AnalysisContext.ts

import { createContext, useContext } from 'react';
import { ICountry } from "./charts/ICountry";
import { IState } from "./charts/IState";
import { ICity } from "./charts/ICity";
import { IStackedAreaChart } from './charts/IStackedAreaChart';
import { IPercentualAreaChart } from './charts/IPercentualAreaChart';

// Interface para o contexto
export interface AnalysisContextProps {
    organicasStackedData: IStackedAreaChart[];
    organicasPercentual?: IPercentualAreaChart[];
    poluicaoStackedData?: IStackedAreaChart[];
    cities: ICity[];
    states: IState[];
    countries: ICountry[];
    fetchData: () => Promise<boolean>;
}

// Criação do contexto
export const AnalysisContext = createContext<AnalysisContextProps>({
    organicasStackedData: [],
    organicasPercentual: [],
    cities: [],
    states: [],
    countries: [],
    fetchData: () => Promise.resolve(false),
});

// Hook para utilizar o contexto
export const useAnalysisContext = () => {
    const context = useContext(AnalysisContext);
    if (!context) {
        throw new Error('useAnalysisContext deve ser usado dentro de um AnalysisProvider');
    }
    if (!context.countries || context.countries.length === 0) {
        throw new Error('useAnalysisContext: countries is required');
    }
    if (!context.states || context.states.length === 0) {
        throw new Error('useAnalysisContext: states is required');
    }
    if (!context.cities || context.cities.length === 0) {
        throw new Error('useAnalysisContext: cities is required');
    }
    if (!context.organicasStackedData || context.organicasStackedData.length === 0) {
        throw new Error('useAnalysisContext: organicasStackedData is required');
    }
    return context;
};
