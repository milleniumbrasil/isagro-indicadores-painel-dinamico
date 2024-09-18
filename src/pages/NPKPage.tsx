// src/pages/NPKPage.tsx

import './NPKPage.css';

import { FC, useEffect, useState, Suspense } from 'react';
import { IPercentualAreaChart, IStackedAreaChart } from '../types';
import { useNPKContext } from '../components/NPKContext';
import PaperNPK from '../components/PaperNPK';
import { Loader } from 'rsuite';

export function Loading() {
    return (
        <div>
            <Loader backdrop content="loading..." vertical />
        </div>
    );
}

const Page: FC = () => {
    // dados do servidor armazenados no contexto
    const { states: contextStates } = useNPKContext();
    const { countries: contextCountries } = useNPKContext();
    const { cities: contextCities } = useNPKContext();
    const { npkStackedData: contextNpkStackedData } = useNPKContext();
    const { npkPercentual: contextNpkPercentual } = useNPKContext();

    const [internalNpkStacked, setInternalNpkStacked] = useState<IStackedAreaChart[]>([]);
    const [internalNpkPercentual, setInternalNpkPercentual] = useState<IPercentualAreaChart[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (contextNpkPercentual && contextNpkPercentual.length > 0) {
                    setInternalNpkPercentual(contextNpkPercentual);
                    console.log(`[Page] internalNpkPercentual loaded from context: ${contextNpkPercentual.length}`);
                } else {
                    throw new Error('Page: contextNpkPercentual is required');
                }
                if (contextNpkStackedData && contextNpkStackedData.length > 0) {
                    setInternalNpkStacked(contextNpkStackedData);
                    console.log(`[Page] internalNpkStacked loaded from context: ${internalNpkStacked.length}`);
                } else {
                    throw new Error('Page: contextNpkStackedData is required');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [contextNpkPercentual, contextNpkStackedData]);

    return (
        <Suspense fallback={<Loading />}>
            {internalNpkPercentual.length > 0 ? (
                <PaperNPK
                    stackedData={internalNpkStacked}
                    percentualData={internalNpkPercentual}
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

export default Page;
