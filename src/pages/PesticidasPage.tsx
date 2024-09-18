// src/pages/PesticidasPage.tsx

import './PesticidasPage.css';

import { FC, useEffect, useState, Suspense } from 'react';
import { usePesticidasContext } from '../components/pesticidas/PesticidasContext';
import { IStackedAreaChart } from '../components/charts/types';
import { IPercentualAreaChart } from '../components/charts/IPercentualAreaChart';
import PaperPesticidas from '../components/pesticidas/PaperPesticidas';
import { Loader } from 'rsuite';

export function Loading() {
    return (
        <div>
            <Loader backdrop content="loading..." vertical />
        </div>
    );
}

const PesticidasPage: FC = () => {
    // dados do servidor armazenados no contexto
    const { contextStates: contextStates } = usePesticidasContext();
    const { contextCountries: contextCountries } = usePesticidasContext();
    const { contextCities } = usePesticidasContext();
    const { contextStackedData: contextPesticidasStackedData } = usePesticidasContext();
    const { contextPercentualData: contextPesticidasPercentual } = usePesticidasContext();

    const [internalPesticidasStacked, setInternalPesticidasStacked] = useState<IStackedAreaChart[]>([]);
    const [internalPesticidasPercentual, setInternalPesticidasPercentual] = useState<IPercentualAreaChart[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (contextPesticidasPercentual && contextPesticidasPercentual.length > 0) {
                    setInternalPesticidasPercentual(contextPesticidasPercentual);
                    console.log(`[PesticidasPage] internalPesticidasPercentual loaded from context: ${contextPesticidasPercentual.length}`);
                } else {
                    console.warn('[PesticidasPage] contextPesticidasPercentual is required');
                }
                if (contextPesticidasStackedData && contextPesticidasStackedData.length > 0) {
                    setInternalPesticidasStacked(contextPesticidasStackedData);
                    console.log(`[PesticidasPage] internalPesticidasStacked loaded from context: ${internalPesticidasStacked.length}`);
                } else {
                    console.warn('[PesticidasPage] contextPesticidasStackedData is required');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [contextPesticidasPercentual, contextPesticidasStackedData]);

    return (
        <Suspense fallback={<Loading />}>
            {internalPesticidasPercentual.length > 0 ? (
                <PaperPesticidas
                    stackedData={internalPesticidasStacked}
                    percentualData={internalPesticidasPercentual}
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

export default PesticidasPage;
