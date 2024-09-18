// src/pages/PoluicoesPage.tsx

import './PoluicoesPage.css';

import { FC, useEffect, useState, Suspense } from 'react';
import { usePoluicoesContext } from '../components/poluicoes/PoluicoesContext';
import { IStackedAreaChart } from '../components/charts/types';
import { IPercentualAreaChart } from '../components/charts/IPercentualAreaChart';
import PaperPoluicoes from '../components/poluicoes/PaperPoluicoes';
import { Loader } from 'rsuite';

export function Loading() {
    return (
        <div>
            <Loader backdrop content="loading..." vertical />
        </div>
    );
}

const PoluicoesPage: FC = () => {
    // dados do servidor armazenados no contexto
    const { contextStates: contextStates } = usePoluicoesContext();
    const { contextCountries: contextCountries } = usePoluicoesContext();
    const { contextCities } = usePoluicoesContext();
    const { contextStackedData: contextPoluicoesStackedData } = usePoluicoesContext();
    const { contextPercentualData: contextPoluicoesPercentual } = usePoluicoesContext();

    const [internalPoluicoesStacked, setInternalPoluicoesStacked] = useState<IStackedAreaChart[]>([]);
    const [internalPoluicoesPercentual, setInternalPoluicoesPercentual] = useState<IPercentualAreaChart[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (contextPoluicoesPercentual && contextPoluicoesPercentual.length > 0) {
                    setInternalPoluicoesPercentual(contextPoluicoesPercentual);
                    console.log(`[PoluicoesPage] internalPoluicoesPercentual loaded from context: ${contextPoluicoesPercentual.length}`);
                } else {
                    console.warn('[PoluicoesPage] contextPoluicoesPercentual is required');
                }
                if (contextPoluicoesStackedData && contextPoluicoesStackedData.length > 0) {
                    setInternalPoluicoesStacked(contextPoluicoesStackedData);
                    console.log(`[PoluicoesPage] internalPoluicoesStacked loaded from context: ${internalPoluicoesStacked.length}`);
                } else {
                    console.warn('[PoluicoesPage] contextPoluicoesStackedData is required');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [contextPoluicoesPercentual, contextPoluicoesStackedData]);

    return (
        <Suspense fallback={<Loading />}>
            {internalPoluicoesPercentual.length > 0 ? (
                <PaperPoluicoes
                    stackedData={internalPoluicoesStacked}
                    percentualData={internalPoluicoesPercentual}
                    countries={contextCountries}
                    states={contextStates}
                    cities={contextCities}
                />
            ) : (
                <Loading />
            )}
        </Suspense>
    );
};

export default PoluicoesPage;
