// src/components/BarChart.tsx

import { useEffect, useState } from 'react';
import { AreaChart as RechatsStackedAreaChart, BarChart as RechartsBarChart, ComposedChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line } from 'recharts';
import { whiteBackgroundColor, palettes } from '../colors';
import { IDataChart } from './IDataChart';

interface BarMediaMovelChartProps {
    data: IDataChart[];
    tendencyDataKey?: string;
    width?: number;
    height?: number;
}

export function Loading() {
    return (
        <p>
            <i>Loading...</i>
        </p>
    );
}

const BarMediaMovelChart: React.FC<BarMediaMovelChartProps> = (props) => {
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

    const extractAttibutesNames = (_data: IDataChart[]): string[] => {
        let result: string[] = [];
        if (_data && _data.length > 0) {
            // console.log('[BarMediaMovelChart] extractAttibutesNames:', JSON.stringify(normalizedData, null, 2));
            const attrNamesSet = new Set<string>();
            _data.forEach((item) => {
                Object.keys(item).forEach((key) => {
                    if (key !== 'period') {
                        attrNamesSet.add(key);
                    }
                });
            });
            const attrNames = Array.from(attrNamesSet);
            // console.log(`[BarMediaMovelChart] extractAttibutesNames Final attribute names: ${JSON.stringify(attrNames, null, 2)}`);
            result = attrNames;
        } else {
            console.warn('[BarMediaMovelChart] extractAttibutesNames: normalizedData is empty or undefined');
        }
        return result;
    };

    const [dataKey, setDataKey] = useState<string>('period');
    const [internalData, setInternalData] = useState<IDataChart[]>([]);
    const [internalTendencyDataKey, setInternalTendencyDataKey] = useState<String>('');
    const [internalWidth, setInternalWidth] = useState<number>(800);
    const [internalHeight, setInternalHeight] = useState<number>(1200);
    const [attributeNames, setAttributeNames] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [dynamicTicks, setDynamicTicks] = useState<number[]>([0]);
    const [defaultPalette, setDefaultPalette] = useState<string[]>(
        palettes.find(palette => palette.value === 'greenDark')?.colors.map(color => color.color) || []
    );
    const [internalTendencyPalette, setInternalTendencyPalette] = useState<string[]>(
        palettes.find(palette => palette.value === 'redDark')?.colors.map(color => color.color) || []
    );

    useEffect(() => {
        try {
            if (!props.data || props.data.length === 0) {
                console.warn('[BarMediaMovelChart]: data is required at first useEffect stage! It should be loaded from props.data.');
                setLoading(false);
                return;
            } else {
                const data = Array.from(props.data);
                setInternalData(data);
                const attrNames = extractAttibutesNames(data);
                setAttributeNames(attrNames);

                if (props.width) setInternalWidth(props.width);
                if (props.height) setInternalHeight(props.height);
                if (props.tendencyDataKey) setInternalTendencyDataKey(props.tendencyDataKey);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [props.data, props.tendencyDataKey, props.width, props.height]);

    useEffect(() => {
        // console.log(`[BarMediaMovelChart] useEffect internalData: ${JSON.stringify(internalData.slice(0, 2), null, 2)}`);
    }, [internalData]);

    return (
        <div style={{ width: '100%', height: internalHeight }}>
            <ResponsiveContainer>
                <ComposedChart
                    width={internalWidth}
                    height={internalHeight}
                    data={internalData}
                    margin={{
                        top: 10,
                        right: 20,
                        left: 20,
                        bottom: 10,
                    }}
                    style={{ fontSize: 10, padding: '15px' }}
                >
                    <CartesianGrid strokeDasharray="0" />
                    <XAxis dataKey={dataKey} />
                    <YAxis tickFormatter={tickFormatter} ticks={dynamicTicks} />
                    <Legend formatter={legendFormatter} iconType={'triangle'} layout="vertical" verticalAlign="middle" align='left' />
                    <Tooltip content={<CustomTooltip />} />
                    {attributeNames.map((_className, _indexClass) => (
                        _className === internalTendencyDataKey ? (
                            <Line
                                key={_className}
                                type="monotone"
                                dataKey={_className}
                                stroke={internalTendencyPalette[_indexClass % internalTendencyPalette.length]}
                                fill={internalTendencyPalette[_indexClass % internalTendencyPalette.length]}
                            />
                        ) : (
                            <Bar
                                key={_className}
                                type="monotone"
                                dataKey={_className}
                                stackId="1"
                                stroke={defaultPalette[_indexClass % defaultPalette.length]}
                                fill={defaultPalette[_indexClass % defaultPalette.length]}
                            />
                        )
                    ))}
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );


};
export default BarMediaMovelChart;
