// src/pages/GEEPage.tsx

import './GEEPage.css';

import { FC, useEffect, useState, Suspense } from 'react';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useGEEContext } from '../components/GEEContext';
import { IPercentualAreaChart, IStackedAreaChart } from '../types';
import PaperGEE from '../components/PaperGEE';

export function Loading() {
    return (
        <p>
            <i>Loading...</i>
        </p>
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
        <div>
            <Stack spacing={2} sx={{ alignItems: 'center' }}>
                <Card variant="outlined" sx={{ width: '90%' }}>
                    <CardContent>
                        <h3>GEE</h3>
                    </CardContent>
                </Card>

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
            </Stack>
        </div>
    );
};

export default GEEPage;
