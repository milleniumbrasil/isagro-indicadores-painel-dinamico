// src/pages/NPKPage.tsx

import './NPKPage.css';

import { FC, useEffect, useState, Suspense } from 'react';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { IPercentualAreaChart, IStackedAreaChart } from '../types';
import { useISAgroContext } from '../components/ISAgroContext';
import PaperNPK from '../components/PaperNPK';

export function Loading() {
    return (
        <p>
            <i>Loading...</i>
        </p>
    );
}

const Page: FC = () => {
    // dados do servidor armazenados no contexto
    const { states: contextStates } = useISAgroContext();
    const { countries: contextCountries } = useISAgroContext();
    const { cities: contextCities } = useISAgroContext();
    const { npkStackedData: contextNpkStackedData } = useISAgroContext();
    const { npkPercentual: contextNpkPercentual } = useISAgroContext();

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
        <div>
            <Stack spacing={2} sx={{ alignItems: 'center' }}>
                <Card variant="outlined" sx={{ width: '90%' }}>
                    <CardContent>
                        <h3>Componentes</h3>
                    </CardContent>
                </Card>

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

            </Stack>
        </div>
    );
};

export default Page;
