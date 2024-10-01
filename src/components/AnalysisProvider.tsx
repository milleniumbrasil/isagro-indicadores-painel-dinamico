// src/components/AnalysisProvider.tsx

import { FC, ReactNode } from 'react';
import { IStackedAreaChart } from './charts/IStackedAreaChart';
import { IPercentualAreaChart } from './charts/IPercentualAreaChart';
import { AnalysisContext } from './AnalysisContext';

export const AnalysisProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const fetchStackedData = async (
        url: string,
        startDate: Date,
        endDate: Date,
        analysis: string,
        interval: string,
        stateName: string,
        source: string,
        label: string
    ): Promise<IStackedAreaChart[]> => {
        return fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('[AnalysisProvider] fetchStackedData Falha ao buscar os dados!');
                }
                return response.json(); // Convertendo a resposta para JSON
            })
            .then((data: IStackedAreaChart[]) => {
                console.log(`[AnalysisProvider] fetchStackedData response data: ${JSON.stringify(data, null, 2)}`);
                return data; // Retornando os dados para a função chamadora
            })
            .catch((error) => {
                console.error('[AnalysisProvider] fetchStackedData Erro ao buscar os dados:', error);
                return []; // Em caso de erro, retornar array vazio para evitar falhas
            });
    };

    const fetchPercentageData = async (url: string, startDate: Date, endDate: Date, analysis: string, interval: string): Promise<IPercentualAreaChart[]> => {
        // const url = buildUrl('percentage', startDate, endDate, analysis, interval);

        try {
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
            console.log(`[AnalysisProvider] fetchPercentageData result: ${JSON.stringify(percentualData, null, 2)}`);
            return percentualData;
        } catch (error) {
            console.error('Erro ao buscar os dados de percentage:', error);
        }
        return [];
    };

    const value = {
        fetchPercentageData,
        fetchStackedData,
    };

    return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
};
