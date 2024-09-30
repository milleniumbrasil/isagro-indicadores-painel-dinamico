

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
    fetchRequiredData: () => Promise<boolean>;
    fetchSmaData: (startDate: Date, endDate: Date, selectedAnalysis: string, interval: string) => Promise<IStackedAreaChart[]>;
    fetchPercentageData: (startDate: Date, endDate: Date, analysis: string, interval: string) => Promise<IPercentualAreaChart[]>;
    fetchStackedData: (startDate: Date, endDate: Date, analysis: string, interval: string, stateName: string, source: string, label: string) => Promise<IStackedAreaChart[]>;
}

// Criação do contexto
export const AnalysisContext = createContext<AnalysisContextProps>({
    organicasStackedData: [],
    organicasPercentual: [],
    cities: [],
    states: [],
    countries: [],
    fetchRequiredData: () => Promise.resolve(false),
    fetchSmaData: (startDate: Date, endDate: Date, selectedAnalysis: string, interval: string) => Promise.resolve([]),
    fetchPercentageData: (startDate: Date, endDate: Date, analysis: string, interval: string) => Promise.resolve([]),
    fetchStackedData: (startDate: Date, endDate: Date, analysis: string, interval: string, stateName: string, source: string, label: string) => Promise.resolve([]),
});

// Hook para utilizar o contexto
export const useAnalysisContext = () => {
    const context = useContext(AnalysisContext);
    if (!context) {
        throw new Error('useAnalysisContext deve ser usado dentro de um AnalysisProvider');
    }
    return context;
};
