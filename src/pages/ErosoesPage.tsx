// src/pages/ErosoesPage.tsx

import './ErosoesPage.css';

import { FC, useEffect, useState, Suspense } from 'react';
import { useErosoesContext } from '../components/ErosoesContext';
import { IPercentualAreaChart, IStackedAreaChart } from '../types';
import PaperErosoes from '../components/PaperErosoes';
import { Loader } from 'rsuite';

export function Loading() {
    return (
        <div>
            <Loader backdrop content="loading..." vertical />
        </div>
    );
}

const ErosoesPage: FC = () => {
    // dados do servidor armazenados no contexto
    const { contextStates: contextStates } = useErosoesContext();
    const { contextCountries: contextCountries } = useErosoesContext();
    const { contextCities } = useErosoesContext();
    const { contextStackedData: contextErosoesStackedData } = useErosoesContext();
    const { contextPercentualData: contextErosoesPercentual } = useErosoesContext();

    const [internalErosoesStacked, setInternalErosoesStacked] = useState<IStackedAreaChart[]>([]);
    const [internalErosoesPercentual, setInternalErosoesPercentual] = useState<IPercentualAreaChart[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (contextErosoesPercentual && contextErosoesPercentual.length > 0) {
                    setInternalErosoesPercentual(contextErosoesPercentual);
                    console.log(`[ErosoesPage] internalErosoesPercentual loaded from context: ${contextErosoesPercentual.length}`);
                } else {
                    console.warn('[ErosoesPage] contextErosoesPercentual is required');
                }
                if (contextErosoesStackedData && contextErosoesStackedData.length > 0) {
                    setInternalErosoesStacked(contextErosoesStackedData);
                    console.log(`[ErosoesPage] internalErosoesStacked loaded from context: ${internalErosoesStacked.length}`);
                } else {
                    console.warn('[ErosoesPage] contextErosoesStackedData is required');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [contextErosoesPercentual, contextErosoesStackedData]);

    return (
        <Suspense fallback={<Loading />}>
            {internalErosoesPercentual.length > 0 ? (
                <PaperErosoes
                    stackedData={internalErosoesStacked}
                    percentualData={internalErosoesPercentual}
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

export default ErosoesPage;
