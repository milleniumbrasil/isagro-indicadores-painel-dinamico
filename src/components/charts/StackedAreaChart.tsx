// src/components/StackedAreaChart.tsx

import { useEffect, useState } from 'react';
import { AreaChart as RechatsStackedAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { greenPalette, whiteBackgroundColor } from '../colors';
import { IStackedAreaChart } from './IStackedAreaChart';

export interface INormalizedData {
    period: string;
    [label: string]: number | string;
}

interface StackedAreaChartProps {
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

const StackedAreaChart: React.FC<StackedAreaChartProps> = (props) => {
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

    const renderTooltipContent = (obj: any) => {
        const { payload = [] } = obj;
        console.log(`[StackedAreaChart] renderTooltipContent obj: ${JSON.stringify(obj, null, 2)}`);

        return (
            <div
                className="customized-tooltip-content"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px', fontFamily: 'Arial, sans-serif' }}
            >
                <ul className="list" style={{ listStyleType: 'none', padding: 0, fontSize: '12px' }}>
                    {payload.map((entry: any, index: number) => {
                        const fontColor = 'black';
                        const entryPayload = entry.payload || {};

                        // Filtrar todas as chaves que não são 'period'
                        const filteredKeys = Object.keys(entryPayload).filter((key) => key !== 'period');

                        return (
                            <li key={`item-${index}`} style={{ color: fontColor }}>
                                {filteredKeys.map((key) => (
                                    <div key={key}>
                                        {firstLetter2UpperCase(key)}: {entryPayload[key]}
                                    </div>
                                ))}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
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
        // console.log(`[StackedAreaChart] normalizeData input: ${JSON.stringify(data?.slice(0, 2), null, 2)}`);

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
        // console.log(`[StackedAreaChart] normalizeData result: ${JSON.stringify(result?.slice(0, 2), null, 2)}`);
        return result;
    }

    // Função para calcular os steps
    const calculateSteps = (data: { [key: string]: any }[]): number[] => {
        // Verifica se o array não está vazio
        if (data.length === 0) return [0, 0, 0, 0, 0];

        const maxTotal = Math.max(
            ...data.map((d: { [key: string]: any }) => {
                const total = Object.values(d).reduce((sum: number, value: any) => {
                    if (typeof value === 'number') return sum + value;
                    else return sum;
                }, 0);
                return total;
            }),
        );

        // Se maxTotal for 0, retorna steps com valores iniciais
        if (maxTotal === 0) return [0, 0, 0, 0, 0];

        const step = Math.ceil(maxTotal / 4);
        return [0, step, step * 2, step * 3, step * 4]; // Ticks dinâmicos
    };

    const extractAttibutesNames = (normalizedData: INormalizedData[]): string[] => {
        let result: string[] = [];
        if (normalizedData && normalizedData.length > 0) {
            // console.log('[StackedAreaChart] extractAttibutesNames:', JSON.stringify(normalizedData, null, 2));
            const attrNamesSet = new Set<string>();
            normalizedData.forEach((item) => {
                Object.keys(item).forEach((key) => {
                    if (key !== 'period') {
                        attrNamesSet.add(key);
                    }
                });
            });
            const attrNames = Array.from(attrNamesSet);
            console.log(`[StackedAreaChart] extractAttibutesNames Final attribute names: ${JSON.stringify(attrNames, null, 2)}`);
            result = attrNames;
        } else {
            console.log('[StackedAreaChart] extractAttibutesNames: normalizedData is empty or undefined');
        }
        return result;
    };

    const [dataKey, setDataKey] = useState<string>('period');
    const [internalData, setInternalData] = useState<INormalizedData[]>([]);
    const [internalWidth, setInternalWidth] = useState<number>(800);
    const [internalHeight, setInternalHeight] = useState<number>(1200);
    const [internalStrokeColor, setInternalStrockeColor] = useState<string[]>(greenPalette);
    const [internalFillColor, setInternalFillColor] = useState<string[]>(greenPalette);
    const [attributeNames, setAttributeNames] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [dynamicTicks, setDynamicTicks] = useState<number[]>([0]);
    const [defaultPalette, setDefaultPalette] = useState<string[]>(greenPalette);

    useEffect(() => {
        try {
            console.log(`[StackedAreaChart] data: ${JSON.stringify(props.data)}`);
            if (!props.data || props.data.length === 0) {
                console.warn('[StackedAreaChart]: data is required at first useEffect stage! It should be loaded from props.data.');
                setLoading(false);
                return;
            } else {
                const data = Array.from(props.data);
                const normalizedData = normalizeData(data);
                // console.log(`[StackedAreaChart] useEffect data: ${JSON.stringify(data?.slice(0, 2), null, 2)}`);
                console.log(`[StackedAreaChart] useEffect normalizedData: ${JSON.stringify(normalizedData?.slice(0, 2), null, 2)}`);
                setInternalData(normalizedData);
                if (props.width) setInternalWidth(props.width);
                console.log(`[StackedAreaChart] internalWidth: ${internalWidth}`);
                if (props.height) setInternalHeight(props.height);
                console.log(`[StackedAreaChart] internalHeight: ${internalHeight}`);
                if (props.defaultPalette) setDefaultPalette(props.defaultPalette);
                console.log(`[StackedAreaChart] defaultPalette: ${defaultPalette}`);
                const attrNames = extractAttibutesNames(normalizedData);
                console.log(`[StackedAreaChart] Final attribute names: ${JSON.stringify(attrNames)}`);
                setAttributeNames(attrNames);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [props.data, props.dataKey, props.valueLabel, props.width, props.height, props.defaultPalette]);

    return (
        <div style={{ width: '100%', height: internalHeight }}>
            <ResponsiveContainer>
                <RechatsStackedAreaChart
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
                    <Legend formatter={legendFormatter} iconType={'triangle'} />
                    <Tooltip content={<CustomTooltip />} />
                    {attributeNames.map((item, index) => (
                        <Area
                            key={item}
                            type="monotone"
                            dataKey={item}
                            stackId="1"
                            stroke={internalStrokeColor[index % internalStrokeColor.length]}
                            fill={internalFillColor[index % internalFillColor.length]}
                        />
                    ))}
                </RechatsStackedAreaChart>
            </ResponsiveContainer>
        </div>
    );
};
export default StackedAreaChart;
