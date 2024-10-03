// src/components/BarChart.tsx

import { useEffect, useState } from 'react';
import { AreaChart as RechatsStackedAreaChart, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { whiteBackgroundColor, palettes } from '../colors';
import { IStackedAreaChart } from './IStackedAreaChart';
import { IPercentualAreaChart } from './IPercentualAreaChart';

export interface INormalizedData {
    period: string;
    [label: string]: number | string;
}

interface PieChartProps {
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

const PieChart: React.FC<PieChartProps> = (props) => {

    const normalizeData = (_data: IPercentualAreaChart[]): IPercentualAreaChart[] => {
        if (!_data || _data.length === 0) {
            throw new Error('[PercentualAreaChart] Data is undefined for normalizing data!');
        }
        // console.log(`[PercentualAreaChart] Data to normalize: ${JSON.stringify(_data)}`);
        const maxArea = Math.max(..._data.map((i) => i.value)); // Identifica o valor máximo
        const result = _data.map((e) => ({
            ...e,
            value: Math.round((e.value / maxArea) * 100), // Normaliza os valores de 'area' para percentuais
        }));
        // console.log(`[PercentualAreaChart] Normalized data: ${JSON.stringify(result)}`);
        return result;
    };

    const firstLetter2UpperCase = (value: any): string => {
        return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
    };

    const legendFormatter = (value: any, entry: any, index: any): string => {
        const legend = internalValueLabel ? internalValueLabel : value;
        return `${legend.charAt(0).toUpperCase()}${legend.slice(1)}`;
    };

    const tickFormatter = (decimal = 0, fixed = 1): string => {
        return `${Math.round(decimal)}%`;
    };

    const [dataKey, setDataKey] = useState<string>('period');
    const [internalValueLabel, setInternalInternalValueLabel] = useState<string>('Valor');
    const [internalData, setInternalData] = useState<IPercentualAreaChart[] | null>(null);
    const [internalWidth, setInternalWidth] = useState<number>(800);
    const [internalHeight, setInternalHeight] = useState<number>(1200);

    const [defaultPalette, setDefaultPalette] = useState<string[]>(
        palettes.find(palette => palette.value === 'greenLight')?.colors.map(color => color.color) || []
    );
    const [internalStrokeColor, setInternalStrokeColor] = useState<string>(props.strokeColor || defaultPalette[0]);
    const [internalFillColor, setInternalFillColor] = useState<string>(props.fillColor || defaultPalette[1]);

    const [attributeNames, setAttributeNames] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // console.log(`[PercentualAreaChart] data: ${JSON.stringify(props.data)}`);
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
                    if (props.strokeColor) setInternalStrokeColor(props.strokeColor);
                    if (props.fillColor) setInternalFillColor(props.fillColor);
                    if (internalData) {
                        setAttributeNames(Array.from(new Set(internalData?.flatMap(Object.keys))).filter((key) => key !== 'period'));
                    }
                    // console.log('[PercentualAreaChart] Attribute names:', JSON.stringify(attributeNames));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [props.data, props.valueLabel, props.width, props.height, props.strokeColor, props.fillColor]);



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

    return (
        <div style={{ width: '100%', height: internalHeight }}>
            {loading ? ( // Se ainda estiver carregando, exibe o fallback
                <Loading />
            ) : internalData && internalData.length > 0 ? ( // Se os dados estiverem prontos
                <ResponsiveContainer>

                    <RechartsPieChart width={internalWidth} height={internalHeight} >
                        <Tooltip content={<CustomTooltip />} />
                        <Pie
                            type="monotone"
                            dataKey={"period"}
                            stroke={defaultPalette[0]}
                            fill={defaultPalette[0]}

                            data={internalData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            // label={renderCustomizedLabel}
                            outerRadius={80}
                        >
                        {attributeNames.map((item, index) => (
                            <Cell key={`cell-${index}`} fill={internalFillColor} />
                        ))}
                        </Pie>
                        <CartesianGrid strokeDasharray="0" />
                    </RechartsPieChart>
                </ResponsiveContainer>
            ) : (
                <Loading />
            )}
        </div>
    );
};
export default PieChart;
