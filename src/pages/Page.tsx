// src/components/ISAgro/ISAgro.tsx

import './Page.css';

import { FC, useEffect, useState, Suspense } from 'react';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useISAgroContext } from '../components/ISAgroContext';
import PaperOrganicas from '../components/PaperOrganicas';
import { IPercentualAreaChart, IStackedAreaChart } from '../types';

export function Loading() {
    return (
        <p>
            <i>Loading...</i>
        </p>
    );
}

const Page: FC = () => {
    // dados do servidor armazenados no contexto
    const { states } = useISAgroContext();
    const { countries } = useISAgroContext();
    const { cities } = useISAgroContext();
    const { organicasStackedData: contextOrganicasStackedData } = useISAgroContext();
    const { organicasPercentual: contextOrganicasPercentual } = useISAgroContext();

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
                            countries={countries}
                            states={states}
                            cities={cities}
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
