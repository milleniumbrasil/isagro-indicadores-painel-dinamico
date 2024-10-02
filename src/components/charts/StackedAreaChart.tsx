// src/components/StackedAreaChart.tsx

import { useEffect, useState } from 'react';
import { AreaChart as RechatsStackedAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { greenPalette } from '../colors';
import { IStackedAreaChart } from './IStackedAreaChart';

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
    }

    const firstLetter2UpperCase = (value: any): string  => {
        return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
    }

    const legendFormatter = (value: any, entry: any, index: any): string  => {
        return firstLetter2UpperCase(value);
    }

    const renderTooltipContent = (obj: any)  => {
        const { payload = [] } = obj;
        console.log(`[StackedAreaChart] renderTooltipContent payload: ${JSON.stringify(payload?.slice(0, 2), null, 2)}}`);
        return (
            <div
                className="customized-tooltip-content"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px', fontFamily: 'Arial, sans-serif' }}
            >
                <ul className="list" style={{ listStyleType: 'none', padding: 0, fontSize: '12px' }}>
                    {payload.map((entry: any, index: number) => {
                        const fontColor = 'black';
                        if (entry.name !== dataKey && attributeNames.includes(entry.name) && typeof entry.value === 'number') {
                            return (
                                <li key={`item-${index}`} style={{ color: fontColor }}>
                                    {firstLetter2UpperCase(entry.name)} {entry.value}
                                </li>
                            );
                        }
                        return null;
                    })}
                </ul>
            </div>
        );
    }

    // Função para normalizar os dados
    const normalizeData = (entries: IStackedAreaChart[]): { [key: string]: any }[] => {
        const normalizedDataSet: any[] = [];

        entries.forEach((entry) => {
            const { period, entry: dataEntry } = entry;
            const [label, value] = dataEntry;

            // buscar a última entry para o periodo e o label
            let normalized;
            normalized = normalizedDataSet.find(
                (item) => item.period === period && !Object.keys(item).find((labelTarget) => labelTarget === label),
            );

            // se já existe uma entry para o periodo e label
            if (normalized) {
                normalized[label] = value;
            } else {
                const newNormalized: { [key: string]: any } = { period: period };
                newNormalized[label] = value;
                normalizedDataSet.push(newNormalized);
            }
        });
        return normalizedDataSet;
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
    }

    const [internalValueLabel, setInternalInternalValueLabel] = useState<string>('Valor');
    const [dataKey, setDataKey] = useState<string>('period');
    const [internalData, setInternalData] = useState<{ [key: string]: any }[]|null>(null);
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
                setInternalData(normalizedData);
                if (props.valueLabel) setInternalInternalValueLabel(props.valueLabel);
                if (props.width) setInternalWidth(props.width);
                if (props.height) setInternalHeight(props.height);
                if (props.defaultPalette) setDefaultPalette(props.defaultPalette);
                if (internalData) {
                    const attrNames = data.flatMap((item) => Object.keys(item).filter((key) => key !== dataKey));
                    setAttributeNames(attrNames);
                }
                console.log('[StackedAreaChart] Attribute names:', JSON.stringify(attributeNames));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [props.data,
        props.dataKey,
        props.valueLabel,
        props.width,
        props.height,
        props.defaultPalette]);

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
                        <Tooltip content={renderTooltipContent} />
                        {attributeNames.map((item, index) => (
                            <Area
                                key={item}
                                type="monotone"
                                dataKey={item}
                                stackId={`${index}`}
                                stroke={internalStrokeColor[index % internalStrokeColor.length]}
                                fill={internalFillColor[index % internalFillColor.length]}
                            />
                        ))}
                    </RechatsStackedAreaChart>
                </ResponsiveContainer>
            </div>
        );

}
export default StackedAreaChart;
