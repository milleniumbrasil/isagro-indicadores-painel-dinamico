// src/pages/OrganicasPage.tsx

import './OrganicasPage.css';

import { FC, useEffect, useState, Suspense } from 'react';

import { IPercentualAreaChart, IStackedAreaChart } from '../types';
import { useOrganicasContext } from '../components/OrganicasContext';
import PaperOrganicas from '../components/PaperOrganicas';

import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export function Loading() {
    return (
        <p>
            <i>Loading...</i>
        </p>
    );
}

const Page: FC = () => {
    // dados do servidor armazenados no contexto
    const { states: contextStates } = useOrganicasContext();
    const { countries: contextCountries } = useOrganicasContext();
    const { cities: contextCities } = useOrganicasContext();
    const { organicasStackedData: contextOrganicasStackedData } = useOrganicasContext();
    const { organicasPercentual: contextOrganicasPercentual } = useOrganicasContext();

    const [internalOrganicasStacked, setInternalOrganicasStacked] = useState<IStackedAreaChart[]>([]);
    const [internalOrganicasPercentual, setInternalOrganicasPercentual] = useState<IPercentualAreaChart[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (contextOrganicasPercentual && contextOrganicasPercentual.length > 0) {
                    setInternalOrganicasPercentual(contextOrganicasPercentual);
                    console.log(`[Page] internalOrganicasPercentual loaded from context: ${contextOrganicasPercentual.length}`);
                } else {
                    throw new Error('Page: contextOrganicasPercentual is required');
                }

                if (contextOrganicasStackedData && contextOrganicasStackedData.length > 0) {
                    setInternalOrganicasStacked(contextOrganicasStackedData);
                    console.log(`[Page] internalOrganicasStacked loaded from context: ${internalOrganicasStacked.length}`);
                } else {
                    throw new Error('Page: contextOrganicasStackedData is required');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [contextOrganicasPercentual, contextOrganicasStackedData]);

    return (
        <div>
            <Stack spacing={2} sx={{ alignItems: 'center' }}>
                <Card variant="outlined" sx={{ width: '90%' }}>
                    <CardContent>
                        <h3>Componentes</h3>
                    </CardContent>
                </Card>

                <Suspense fallback={<Loading />}>
                    {internalOrganicasPercentual.length > 0 ? (
                        <PaperOrganicas
                            stackedData={internalOrganicasStacked}
                            percentualData={internalOrganicasPercentual}
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
