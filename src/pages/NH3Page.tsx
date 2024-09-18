// src/pages/NH3Page.tsx

import './NH3Page.css';

import { FC, useEffect, useState, Suspense } from 'react';
import { useNH3Context } from '../components/nh3s/NH3Context';
import { IPercentualAreaChart, IStackedAreaChart } from '../types';
import PaperNH3 from '../components/nh3s/PaperNH3';
import { Loader } from 'rsuite';

export function Loading() {
    return (
        <div>
            <Loader backdrop content="loading..." vertical />
        </div>
    );
}

const PageNH3: FC = () => {
    // dados do servidor armazenados no contexto
    const { contextStates: contextStates } = useNH3Context();
    const { contextCountries: contextCountries } = useNH3Context();
    const { contextCities } = useNH3Context();
    const { contextStackedData: contextNH3StackedData } = useNH3Context();
    const { contextPercentualData: contextNH3Percentual } = useNH3Context();

    const [internalNH3Stacked, setInternalNH3Stacked] = useState<IStackedAreaChart[]>([]);
    const [internalNH3Percentual, setInternalNH3Percentual] = useState<IPercentualAreaChart[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (contextNH3Percentual && contextNH3Percentual.length > 0) {
                    setInternalNH3Percentual(contextNH3Percentual);
                    console.log(`[PageNH3] internalNH3Percentual loaded from context: ${contextNH3Percentual.length}`);
                } else {
                    console.warn('[PageNH3] contextNH3Percentual is required');
                }
                if (contextNH3StackedData && contextNH3StackedData.length > 0) {
                    setInternalNH3Stacked(contextNH3StackedData);
                    console.log(`[PageNH3] internalNH3Stacked loaded from context: ${internalNH3Stacked.length}`);
                } else {
                    console.warn('[PageNH3] contextNH3StackedData is required');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [contextNH3Percentual, contextNH3StackedData]);

    return (
        <Suspense fallback={<Loading />}>
            {internalNH3Percentual.length > 0 ? (
                <PaperNH3
                    stackedData={internalNH3Stacked}
                    percentualData={internalNH3Percentual}
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

export default PageNH3;
