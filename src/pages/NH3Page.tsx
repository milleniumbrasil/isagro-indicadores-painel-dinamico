// src/pages/NH3Page.tsx

import './NH3Page.css';

import { FC, useEffect, useState, Suspense } from 'react';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useNH3Context } from '../components/NH3Context';
import { IPercentualAreaChart, IStackedAreaChart } from '../types';
import PaperNH3 from '../components/PaperNH3';

export function Loading() {
    return (
        <p>
            <i>Loading...</i>
        </p>
    );
}

const PageNH3: FC = () => {
    // dados do servidor armazenados no contexto
    const { contextStates: contextStates } = useNH3Context();
    const { contextCountries: contextCountries } = useNH3Context();
    const { contextCities } = useNH3Context();
    const { nh3StackedData: contextNH3StackedData } = useNH3Context();
    const { nh3StackedPercentual: contextNH3Percentual } = useNH3Context();

    const [internalNH3Stacked, setInternalNH3Stacked] = useState<IStackedAreaChart[]>([]);
    const [internalNH3Percentual, setInternalNH3Percentual] = useState<IPercentualAreaChart[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (contextNH3Percentual && contextNH3Percentual.length > 0) {
                    setInternalNH3Percentual(contextNH3Percentual);
                    console.log(`[Page] internalNH3Percentual loaded from context: ${contextNH3Percentual.length}`);
                } else {
                    throw new Error('Page: contextNH3Percentual is required');
                }
                if (contextNH3StackedData && contextNH3StackedData.length > 0) {
                    setInternalNH3Stacked(contextNH3StackedData);
                    console.log(`[Page] internalNH3Stacked loaded from context: ${internalNH3Stacked.length}`);
                } else {
                    throw new Error('Page: contextNH3StackedData is required');
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
        <div>
            <Stack spacing={2} sx={{ alignItems: 'center' }}>
                <Card variant="outlined" sx={{ width: '90%' }}>
                    <CardContent>
                        <h3>Componentes</h3>
                    </CardContent>
                </Card>

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
            </Stack>
        </div>
    );
};

export default PageNH3;
