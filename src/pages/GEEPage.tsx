// src/pages/GEEPage.tsx

import './GEEPage.css';

import { FC, useEffect, useState, Suspense } from 'react';
import { useGEEContext } from '../components/GEEContext';
import { IPercentualAreaChart, IStackedAreaChart } from '../types';
import PaperGEE from '../components/PaperGEE';
import { Loader } from 'rsuite';

export function Loading() {
    return (
        <div>
            <Loader backdrop content="loading..." vertical />
        </div>
    );
}

const GEEPage: FC = () => {
    // dados do servidor armazenados no contexto
    const { contextStates: contextStates } = useGEEContext();
    const { contextCountries: contextCountries } = useGEEContext();
    const { contextCities } = useGEEContext();
    const { contextStackedData: contextGEEStackedData } = useGEEContext();
    const { contextPercentualData: contextGEEPercentual } = useGEEContext();

    const [internalGEEStacked, setInternalGEEStacked] = useState<IStackedAreaChart[]>([]);
    const [internalGEEPercentual, setInternalGEEPercentual] = useState<IPercentualAreaChart[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (contextGEEPercentual && contextGEEPercentual.length > 0) {
                    setInternalGEEPercentual(contextGEEPercentual);
                    console.log(`[GEEPage] internalGEEPercentual loaded from context: ${contextGEEPercentual.length}`);
                } else {
                    console.warn('[GEEPage] contextGEEPercentual is required');
                }
                if (contextGEEStackedData && contextGEEStackedData.length > 0) {
                    setInternalGEEStacked(contextGEEStackedData);
                    console.log(`[GEEPage] internalGEEStacked loaded from context: ${internalGEEStacked.length}`);
                } else {
                    console.warn('[GEEPage] contextGEEStackedData is required');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [contextGEEPercentual, contextGEEStackedData]);

    return (
        <Suspense fallback={<Loading />}>
            {internalGEEPercentual.length > 0 ? (
                <PaperGEE
                    stackedData={internalGEEStacked}
                    percentualData={internalGEEPercentual}
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

export default GEEPage;
