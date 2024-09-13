// src/components/PercentualAreaChart.tsx

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IPercentualAreaChart } from '../types';

interface PercentualAreaChartProps {
    data: IPercentualAreaChart[];
    valueLabel?: string;
    width?: number;
    height?: number;
    strokeColor?: string;
    fillColor?: string;
}

export function Loading() {
    return (
        <p>
            <i>Loading...</i>
        </p>
    );
}

const PercentualAreaChart: React.FC<PercentualAreaChartProps> = (props) => {
    const [internalValueLabel, setInternalInternalValueLabel] = useState<string>('Valor');
    const [internalData, setInternalData] = useState<IPercentualAreaChart[] | null>(null);
    const [internalWidth, setInternalWidth] = useState<number>(800);
    const [internalHeight, setInternalHeight] = useState<number>(1200);
    const [internalStrokeColor, setInternalStrockeColor] = useState<string>('#228B22');
    const [internalFillColor, setInternalFillColor] = useState<string>('#228B22');
    const [attributeNames, setAttributeNames] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const normalizeData = (_data: IPercentualAreaChart[]): IPercentualAreaChart[] => {
        if (!_data || _data.length === 0) {
            throw new Error('[PercentualAreaChart] Data is undefined for normalizing data!');
        }
        const maxArea = Math.max(..._data.map((i) => i.value)); // Identifica o valor máximo
        const result = _data.map((e) => ({
            ...e,
            value: (e.value / maxArea) * 100, // Normaliza os valores de 'area' para percentuais
        }));
        return result;
    };

    const legendFormatter = (value: any, entry: any, index: any): string => {
        const legend = internalValueLabel ? internalValueLabel : value;
        return `${legend.charAt(0).toUpperCase()}${legend.slice(1)}`;
    };

    const tickFormatter = (decimal: number = 0, fixed: number = 1): string => {
        return `${Math.round(decimal)}%`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(`[PercentualAreaChart] data: ${JSON.stringify(props.data)}`);
                if (!props.data || props.data.length === 0) {
                    console.warn('[PercentualAreaChart]: data is required at first useEffect stage! It should be loaded from props.data.');
                    setLoading(false);
                    return;
                } else {
                    const normalizedData = normalizeData(props.data);
                    setInternalData(normalizedData);
                    if (props.valueLabel) setInternalInternalValueLabel(props.valueLabel);
                    if (props.width) setInternalWidth(props.width);
                    if (props.height) setInternalHeight(props.height);
                    if (props.strokeColor) setInternalStrockeColor(props.strokeColor);
                    if (props.fillColor) setInternalFillColor(props.fillColor);
                    if (internalData) {
                        setAttributeNames(Array.from(new Set(internalData?.flatMap(Object.keys))).filter((key) => key !== 'period'));
                    }
                    console.log('[PercentualAreaChart] Attribute names:', attributeNames);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [props.data, props.valueLabel, props.width, props.height, props.strokeColor, props.fillColor]);

    const renderTooltipContent = (o: any) => {
        const { payload = [] } = o;

        return (
            <div
                className="customized-tooltip-content"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    padding: '10px',
                    borderRadius: '5px',
                    fontFamily: 'Arial, sans-serif',
                }}
            >
                <ul className="list" style={{ listStyleType: 'none', padding: 0, fontSize: '12px' }}>
                    {payload.map((entry: any, index: number) => {
                        const fontColor = 'black';
                        if (entry.name !== 'period' && attributeNames.includes(entry.name) && typeof entry.value === 'number') {
                            return (
                                <li key={`item-${index}`} style={{ color: fontColor }}>
                                    {internalValueLabel} {entry.value}
                                </li>
                            );
                        }
                        return null;
                    })}
                </ul>
            </div>
        );
    };

    return (
        <div style={{ width: '100%', height: internalHeight }}>
            {loading ? ( // Se ainda estiver carregando, exibe o fallback
                <Loading />
            ) : internalData && internalData.length > 0 ? ( // Se os dados estiverem prontos
                <ResponsiveContainer>
                    <AreaChart
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
                        <XAxis dataKey={'period'} />
                        <YAxis tickFormatter={tickFormatter} ticks={[0, 25, 50, 75, 100]} />
                        <Legend formatter={legendFormatter} />
                        <Tooltip content={renderTooltipContent} />
                        {attributeNames.map((attr) => (
                            <Area
                                key={attr}
                                type="monotone"
                                dataKey={attr}
                                stackId="1"
                                stroke={internalStrokeColor}
                                fill={internalFillColor}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <Loading /> // Caso os dados estejam vazios, exibe um fallback de "Loading"
            )}
        </div>
    );
};

export default PercentualAreaChart;
