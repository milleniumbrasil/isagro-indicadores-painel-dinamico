// src/components/ISAgro/ISAgro.tsx

import './Page.css';

import { FC, useEffect, useState, Suspense } from 'react';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useISAgroContext } from '../components/ISAgroContext';
import PaperOrganicas from '../components/PaperOrganicas';
import { IPercentualAreaChart, IStackedAreaChart } from '../types';
import PaperNPK from '../components/PaperNPK';
import PaperNH3 from '../components/PaperNH3';

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
    const { npkStackedData: contextNpkStackedData } = useISAgroContext();
    const { npkPercentual: contextNpkPercentual } = useISAgroContext();
    const { nh3StackedData: contextNH3StackedData } = useISAgroContext();
    const { nh3StackedPercentual: contextNH3Percentual } = useISAgroContext();

    const [internalNpkStacked, setInternalNpkStacked] = useState<IStackedAreaChart[]>([]);
    const [internalNpkPercentual, setInternalNpkPercentual] = useState<IPercentualAreaChart[]>([]);
    const [internalNH3Stacked, setInternalNH3Stacked] = useState<IStackedAreaChart[]>([]);
    const [internalNH3Percentual, setInternalNH3Percentual] = useState<IPercentualAreaChart[]>([]);
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
                if (contextNpkPercentual && contextNpkPercentual.length > 0) {
                    setInternalNpkPercentual(contextNpkPercentual);
                    console.log(`[Page] internalNpkPercentual loaded from context: ${contextNpkPercentual.length}`);
                } else {
                    throw new Error('Page: contextNpkPercentual is required');
                }
                if (contextNH3Percentual && contextNH3Percentual.length > 0) {
                    setInternalNH3Percentual(contextNH3Percentual);
                    console.log(`[Page] internalNH3Percentual loaded from context: ${contextNH3Percentual.length}`);
                } else {
                    throw new Error('Page: contextNH3Percentual is required');
                }

                if (contextOrganicasStackedData && contextOrganicasStackedData.length > 0) {
                    setInternalOrganicasStacked(contextOrganicasStackedData);
                    console.log(`[Page] internalOrganicasStacked loaded from context: ${internalOrganicasStacked.length}`);
                } else {
                    throw new Error('Page: contextOrganicasStackedData is required');
                }
                if (contextNpkStackedData && contextNpkStackedData.length > 0) {
                    setInternalNpkStacked(contextNpkStackedData);
                    console.log(`[Page] internalNpkStacked loaded from context: ${internalNpkStacked.length}`);
                } else {
                    throw new Error('Page: contextNpkStackedData is required');
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
    }, [contextOrganicasPercentual, contextOrganicasStackedData, contextNpkPercentual, contextNpkStackedData]);

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

                <Suspense fallback={<Loading />}>
                    {internalNpkPercentual.length > 0 ? (
                        <PaperNPK
                            stackedData={internalNpkStacked}
                            percentualData={internalNpkPercentual}
                            countries={countries}
                            states={states}
                            cities={cities}
                        />
                    ) : (
                        <Loading />
                    )}
                </Suspense>

                <Suspense fallback={<Loading />}>
                    {internalNH3Percentual.length > 0 ? (
                        <PaperNH3
                            stackedData={internalNH3Stacked}
                            percentualData={internalNH3Percentual}
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
