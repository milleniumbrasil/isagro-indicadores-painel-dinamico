// src/components/BarChart.tsx

import { useEffect, useState } from 'react';
import { AreaChart as RechatsStackedAreaChart, BarChart as RechartsBarChart, ComposedChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line } from 'recharts';
import { whiteBackgroundColor, palettes } from '../colors';
import { IStackedAreaChart } from './IStackedAreaChart';

export interface INormalizedData {
    period: string;
    [label: string]: number | string;
}

interface BarLineAreaComposedChartProps {
    data: IStackedAreaChart[];
    dataKey?: string;
    valueLabel?: string;
    width?: number;
    height?: number;
    defaultPalette?: string[];
}

export function Loading() {
    return (
        <p>
            <i>Loading...</i>
        </p>
    );
}

const BarLineAreaComposedChart: React.FC<BarLineAreaComposedChartProps> = (props) => {
    const tickFormatter = (decimal = 0, fixed = 1): string => {
        return `${Math.round(decimal as number)}`;
    };

    const firstLetter2UpperCase = (value: any): string => {
        return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
    };

    const legendFormatter = (value: any, entry: any, index: any): string => {
        return firstLetter2UpperCase(value);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const filteredPayload = Object.entries(payload[0].payload)
                .filter(([key]) => key !== 'period')
                .map(([key, value]) => ({ label: key, value }));

            return (
                <div
                    className="custom-tooltip"
                    style={{ backgroundColor: whiteBackgroundColor, padding: '10px', borderRadius: '5px', fontFamily: 'Arial, sans-serif' }}
                >
                    <p className="label">{`Período: ${label}`}</p>
                    {filteredPayload.map((item: any, index: number) => (
                        <p key={index}>{`${firstLetter2UpperCase(item.label)}: ${item.value}`}</p>
                    ))}
                </div>
            );
        }

        return null;
    };

    // Função de validação para detectar duplicatas
    function validateData(data: IStackedAreaChart[]): void {
        const groupedData: Record<string, Record<string, number[]>> = {};

        data.forEach(({ period, entry }) => {
            const [label, value] = entry;

            // Inicializa a estrutura se o período ainda não existir
            if (!groupedData[period]) {
                groupedData[period] = {};
            }

            // Se o label já existir para esse período, armazena os valores duplicados
            if (groupedData[period][label]) {
                groupedData[period][label].push(value);
            } else {
                groupedData[period][label] = [value];
            }
        });

        // Verifica se existem duplicatas e lança um erro com detalhes, se for o caso
        const duplicates: string[] = [];
        Object.keys(groupedData).forEach((period) => {
            Object.keys(groupedData[period]).forEach((label) => {
                if (groupedData[period][label].length > 1) {
                    const values = groupedData[period][label].join(', ');
                    duplicates.push(`Período '${period}' tem labels duplicados: ${label}, ${values}`);
                }
            });
        });

        if (duplicates.length > 0) {
            throw new Error(`Erro: Duplicidade detectada. Corrija os dados. Detalhes: ${duplicates.join('; ')}`);
        }
    }

    // Função para normalizar os dados
    function normalizeData(data: IStackedAreaChart[]): INormalizedData[] {
        // Chama a função de validação para verificar duplicatas
        validateData(data);
        // console.log(`[BarLineAreaComposedChart] normalizeData input: ${JSON.stringify(data?.slice(0, 2), null, 2)}`);

        const groupedData: Record<string, INormalizedData> = {};

        data.forEach(({ period, entry }) => {
            const [label, value] = entry;

            // Inicializa o período, se necessário
            if (!groupedData[period]) {
                groupedData[period] = { period } as INormalizedData;
            }

            // Atribui o valor ao label correspondente
            groupedData[period][label] = value;
        });

        // Retorna os dados normalizados como um array de INormalizedData
        const result = Object.values(groupedData);
        // console.log(`[BarLineAreaComposedChart] normalizeData result: ${JSON.stringify(result?.slice(0, 2), null, 2)}`);
        return result;
    }

    const extractAttibutesNames = (normalizedData: INormalizedData[]): string[] => {
        let result: string[] = [];
        if (normalizedData && normalizedData.length > 0) {
            // console.log('[BarLineAreaComposedChart] extractAttibutesNames:', JSON.stringify(normalizedData, null, 2));
            const attrNamesSet = new Set<string>();
            normalizedData.forEach((item) => {
                Object.keys(item).forEach((key) => {
                    if (key !== 'period') {
                        attrNamesSet.add(key);
                    }
                });
            });
            const attrNames = Array.from(attrNamesSet);
            // console.log(`[BarLineAreaComposedChart] extractAttibutesNames Final attribute names: ${JSON.stringify(attrNames, null, 2)}`);
            result = attrNames;
        } else {
            console.warn('[BarLineAreaComposedChart] extractAttibutesNames: normalizedData is empty or undefined');
        }
        return result;
    };

    const [dataKey, setDataKey] = useState<string>('period');
    const [internalData, setInternalData] = useState<INormalizedData[]>([]);
    const [internalWidth, setInternalWidth] = useState<number>(800);
    const [internalHeight, setInternalHeight] = useState<number>(1200);
    const [attributeNames, setAttributeNames] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [dynamicTicks, setDynamicTicks] = useState<number[]>([0]);
    const [defaultPalette, setDefaultPalette] = useState<string[]>(
        palettes.find(palette => palette.value === 'greenLight')?.colors.map(color => color.color) || []
    );

    useEffect(() => {
        try {
            if (!props.data || props.data.length === 0) {
                console.warn('[BarLineAreaComposedChart]: data is required at first useEffect stage! It should be loaded from props.data.');
                setLoading(false);
                return;
            } else {
                const data = Array.from(props.data);
                const normalizedData = normalizeData(data);
                setInternalData(normalizedData);
                if (props.width) setInternalWidth(props.width);
                if (props.height) setInternalHeight(props.height);

                // Atualize a lógica para definir a paleta correta
                if (props.defaultPalette) {
                    setDefaultPalette(props.defaultPalette.map(color => color)); // Use apenas os valores de cor
                }

                const attrNames = extractAttibutesNames(normalizedData);
                setAttributeNames(attrNames);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [props.data, props.dataKey, props.valueLabel, props.width, props.height, props.defaultPalette]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    width={internalWidth}
                    height={internalHeight}
                    data={internalData}
                    margin={{
                        top: 10,
                        right: 50,
                        left: 10,
                        bottom: 10,
                    }}
                    style={{ fontSize: 8 }}
                >
                    <CartesianGrid strokeDasharray="0" />
                    <XAxis dataKey={dataKey} />
                    <YAxis tickFormatter={tickFormatter} ticks={dynamicTicks} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={legendFormatter} iconType={'triangle'} />
                    {attributeNames.map((item, index) => (
                        <>
                            <Area type="monotone" dataKey={item} fill='#FFFFE0' stroke='#FFFFE0' />
                            <Bar
                                key={item}
                                type="monotone"
                                dataKey={item}
                                stackId="1"
                                barSize={20}
                                stroke={defaultPalette[index % defaultPalette.length]}
                                fill={defaultPalette[index % defaultPalette.length]}
                            />
                            {/* <Line type="monotone" dataKey={item} stroke="#000000" /> */}
                        </>
                    ))}
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};
export default BarLineAreaComposedChart;
