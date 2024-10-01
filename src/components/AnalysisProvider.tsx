// src/components/AnalysisProvider.tsx

import { FC, ReactNode } from 'react';
import { IStackedAreaChart } from './charts/IStackedAreaChart';
import { IPercentualAreaChart } from './charts/IPercentualAreaChart';
import { AnalysisContext } from './AnalysisContext';
import { buildUrl } from '../pages/AnalysisHelper';

export const AnalysisProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const fetchSmaData = async (startDate: Date, endDate: Date, selectedAnalysis: string, interval: string): Promise<IStackedAreaChart[]> => {
        const startDateFormatted = startDate.toISOString().split('T')[0];
        const endDateFormatted = endDate.toISOString().split('T')[0];

        const url = `http://localhost:3001/sma/${interval}?analysis=${encodeURIComponent(
            selectedAnalysis,
        )}&startDate=${startDateFormatted}&endDate=${endDateFormatted}`;

        try {
            console.log(`[AnalysisProvider] fetchSmaData url: ${url}`);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Falha ao buscar os dados de Média Móvel');
            }
            const data: IStackedAreaChart[] = await response.json();
            console.log(`[AnalysisProvider] fetchSmaData result: ${JSON.stringify(data, null, 2)}`);
            return data;
        } catch (error) {
            console.error('Erro ao buscar os dados de Média Móvel:', error);
        }
        return [];
    };

    const fetchStackedData = async (startDate: Date, endDate: Date, analysis: string, interval: string, stateName: string, source: string, label: string): Promise<IStackedAreaChart[]> => {
        let result: IStackedAreaChart[] = []
        const url = buildUrl(startDate, endDate, analysis, interval, stateName, source, label);

        try {
            console.log(`[AnalysisProvider] fetchStackedData url: ${url}`);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Falha ao buscar os dados');

            result = await response.json();
            console.log(`[AnalysisProvider] fetchStackedData result: ${JSON.stringify(result, null, 2)}`);
        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
        }
        return result;
    };

    const fetchPercentageData = async (startDate: Date, endDate: Date, analysis: string, interval: string): Promise<IPercentualAreaChart[]> => {
        let result: IPercentualAreaChart[] = [];
        try {
            const startDateFormatted = startDate.toISOString().split('T')[0];
            const endDateFormatted = endDate.toISOString().split('T')[0];

            const url = `http://localhost:3001/percentage/${interval}?analysis=${encodeURIComponent(
                analysis,
            )}&startDate=${startDateFormatted}&endDate=${endDateFormatted}`;
            console.log(`[AnalysisProvider] fetchPercentageData url: ${url}`);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Falha ao buscar os dados de percentage');
            }
            const stackedData: IStackedAreaChart[] = await response.json();
            // Transformando de IStackedAreaChart para IPercentualAreaChart
            const percentualData: IPercentualAreaChart[] = stackedData.map((item) => ({
                period: item.period,
                value: parseFloat(item.entry[1].toString()), // Pega diretamente o valor de entry[1] como percentual
            }));
            result = percentualData;
            console.log(`[AnalysisProvider] fetchPercentageData result: ${JSON.stringify(result, null, 2)}`);
        } catch (error) {
            console.error('Erro ao buscar os dados de percentage:', error);
        }
        return result;
    };

    const value = {
        fetchSmaData,
        fetchPercentageData,
        fetchStackedData,
    };

    return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
};
