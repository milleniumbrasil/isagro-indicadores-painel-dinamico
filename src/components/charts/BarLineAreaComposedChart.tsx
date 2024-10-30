// src/components/charts/BarLineAreaComposedChart.tsx

import { useEffect, useState } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line, LabelList, Label, Rectangle } from 'recharts';
import { IStackedAreaChart } from './IStackedAreaChart';

export interface INormalizedData {
    period: string;
    [label: string]: number | string;
}

interface BarLineAreaComposedChartProps {
    data: IStackedAreaChart[];
    tendencyData?: IStackedAreaChart[];
    onLabelSelect?: (newLabel: string) => void;
    onPeriodSelect?: (newPeriod: string) => void;
    oncolorSelect?: (newColor: string) => void;
    width?: number;
    height?: number;
    stacked?: boolean;
    legend?: boolean;
    layout?: 'horizontal' | 'vertical';
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
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', padding: '10px', borderRadius: '5px', fontFamily: 'Arial, sans-serif' }}
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

    // Função para normalizar os dados
    function normalizeTicks(_data: IStackedAreaChart[]): number[] {
        let total = 0;

        // Encontra o valor máximo
        _data.forEach(({ period, entry }) => {
            const [label, value] = entry;
            if (total < value) total = value;
        });

        // Calcula o incremento e inicializa o array de resultados com zero
        const increment = total / 4;
        const result = [0];

        // Gera os próximos valores até o valor máximo
        for (let i = 1; i <= 4; i++) {
            result.push(increment * i);
        }

        return result;
    }

    // Função para normalizar os dados
    function normalizeTendencyData(data: IStackedAreaChart[]): INormalizedData[] {
        // Chama a função de validação para verificar duplicatas
        validateData(data);
        // console.log(`[BarLineAreaComposedChart] normalizeTendencyData input: ${JSON.stringify(data?.slice(0, 2), null, 2)}`);

        const groupedData: Record<string, INormalizedData> = {};

        data.forEach(({ period, entry }) => {
            const [label, value] = entry;

            // Inicializa o período, se necessário
            if (!groupedData[period]) {
                groupedData[period] = { period } as INormalizedData;
            }

            // Atribui o valor ao label correspondente
            groupedData[period][`≈ ${label}`] = value;
        });

        // Retorna os dados normalizados como um array de INormalizedData
        const result = Object.values(groupedData);
        // console.log(`[BarLineAreaComposedChart] normalizeTendencyData result: ${JSON.stringify(result?.slice(0, 2), null, 2)}`);
        return result;
    }

    // Função para normalizar os dados
    function consolidateData(_data: INormalizedData[], _tendencyData: INormalizedData[]): INormalizedData[] {
        const consolidatedDate: INormalizedData[] = [..._data];
        const groupedData: Record<string, INormalizedData> = {};

        _tendencyData.forEach((tendency) => {
            let entry = consolidatedDate.find((e: INormalizedData) => e.period === tendency.period);

            // Se a entrada não existir, cria uma nova entrada
            if (!entry) {
                entry = { period: tendency.period } as INormalizedData;
                consolidatedDate.push(entry);
            }

            // Copia todos os atributos filhos de tendency para a entry
            Object.assign(entry, tendency);

        });

        // console.log(`[BarLineAreaComposedChart] consolidateData result: ${JSON.stringify(consolidatedDate?.slice(0, 2), null, 2)}`);
        return consolidatedDate;
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

    const [internalSelectedLabel, setInternalSelectedLabel] = useState<string|null>(null);
    const [internalSelectedPeriod, setInternalSelectedPeriod] = useState<string|null>(null);
    const [internalData, setInternalData] = useState<INormalizedData[]>([]);
    const [internalTendencyData, setInternalTendencyData] = useState<INormalizedData[]>([]);
    const [internalWidth, setInternalWidth] = useState<number>(800);
    const [internalHeight, setInternalHeight] = useState<number>(1200);
    const [attributeNames, setAttributeNames] = useState<string[]>([]);
    const [tendencyAttributeNames, setTendencyAttributeNames] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [dynamicTicks, setDynamicTicks] = useState<number[]>([0]);
    const [defaultPalette, setDefaultPalette] = useState<string[]>([
        '#008000',
        '#006400',
        '#556B2F',
        '#6B8E23',
        '#01796F',
    ]);
    const [internalTendencyPalette, setInternalTendencyPalette] = useState<string[]>([
            '#FF0000',
            '#8B0000',
            '#A52A2A',
            '#800000',
            '#660000',
        ]);

  // Função recursiva com tipagem para buscar o valor do nome do atributo (_attr)
  function findValueByKey(_obj: any, _attr: string): string | null {
    // console.log(`[BarLineAreaComposedChart] findValueByKey: Iniciando busca pelo período associado ao token: ${_attr}`);
    // Verifica se o objeto não é nulo e é de fato um objeto
    if (_obj && typeof _obj === 'object') {
        // console.log(`[BarLineAreaComposedChart] findValueByKey: Analisando objeto: ${JSON.stringify(_obj, null, 2)}`);
      // Se "_attr" está presente no nível atual, retorna o valor
      if (_attr in _obj) {
        const value = _obj[_attr];
        // console.log(`[BarLineAreaComposedChart] findValueByKey: valor encontrado na chave ${_attr}: ${value}`);
        return value;
      }

      // Itera recursivamente em cada chave do objeto
      for (const key in _obj) {
        if (Object.prototype.hasOwnProperty.call(_obj, key) && typeof _obj[key] === 'object') {
            const result = findValueByKey(_obj[key], _attr); // Chamada recursiva
            if (result) {
                return result;
            }// Retorna o primeiro token encontrado
        }
      }
    }

    // Retorna null se nenhum _attr foi encontrado
    return null;
  }

    const handleBarClick = (_data: { [_x: string]: { _period: any; }; }, _index: string | number) => {
        const periodFound = findValueByKey(_data, 'period');

        if (props.onPeriodSelect && periodFound) {
            props.onPeriodSelect(periodFound);
            setInternalSelectedPeriod(periodFound);
        }
    };

    function handleLegendClick(data: any, index: number): void {
        const dataKeyFound = findValueByKey(data, 'dataKey');

        if (props.onLabelSelect && dataKeyFound) {
            props.onLabelSelect(dataKeyFound);
            setInternalSelectedLabel(dataKeyFound);
        }

        if (props.oncolorSelect && dataKeyFound) {
            const colorFound = findValueByKey(data, 'fill');
            if (colorFound) props.oncolorSelect(colorFound);
        }
    }

    useEffect(() => {
        try {
            if (!props.data || props.data.length === 0) {
                console.warn('[BarLineAreaComposedChart]: data is required at first useEffect stage! It should be loaded from props.data.');
                setLoading(false);
                return;
            } else {
                const data = Array.from(props.data);
                const normalizedData = normalizeData(data);
                const attrNames = extractAttibutesNames(normalizedData);
                setAttributeNames(attrNames);
                const ticks = normalizeTicks(data);
                setDynamicTicks(ticks);
                if (props.tendencyData && props.tendencyData.length > 0) {
                    const tendencyData = Array.from(props.tendencyData);
                    const normalizedTendencyData = normalizeTendencyData(tendencyData);
                    setInternalTendencyData(normalizedTendencyData);
                    const tendencyAttrNames = extractAttibutesNames(normalizedTendencyData);
                    setTendencyAttributeNames(tendencyAttrNames);
                    const consolidatedDate = consolidateData(normalizedData, normalizedTendencyData);
                    // console.log(`[BarLineAreaComposedChart] useEffect consolidatedDate: ${JSON.stringify(consolidatedDate.slice(2), null, 2)}`);
                    setInternalData(consolidatedDate);
                    // console.log(`[BarLineAreaComposedChart] useEffect internalData: ${JSON.stringify(internalData.slice(2), null, 2)}`);
                } else {
                    setInternalData(normalizedData);
                    // console.log(`[BarLineAreaComposedChart] useEffect internalData: ${JSON.stringify(internalData.slice(2), null, 2)}`);
                }

                if (props.width) setInternalWidth(props.width);
                if (props.height) setInternalHeight(props.height);
                if (props.defaultPalette) setDefaultPalette(props.defaultPalette);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [props.data, props.tendencyData, props.width, props.height, props.defaultPalette]);

    return (
        <div style={{ width: '100%', height: internalHeight }}>
            <ResponsiveContainer>
                <ComposedChart
                    layout={props.layout || 'horizontal'}
                    width={internalWidth}
                    height={internalHeight}
                    data={internalData}
                    margin={{
                        top: 10,
                        right: 20,
                        left: 20,
                        bottom: 10,
                    }}
                    style={{ fontSize: 11, padding: '15px' }}
                >
                    <CartesianGrid strokeDasharray="4 4" />
                    {props.layout === 'horizontal' ? <XAxis dataKey="period" type="category"/>: <YAxis dataKey={'period'} type="category"/>}
                    {props.layout === 'horizontal' ? <YAxis tickFormatter={tickFormatter}  />: <XAxis tickFormatter={tickFormatter}  />}

                    {!props.legend &&
                        <Legend formatter={legendFormatter}
                            onClick={handleLegendClick}
                            iconType={'triangle'}
                            layout="vertical"
                            verticalAlign="middle"
                            align={props.layout === 'horizontal'? 'left': 'right'} />}

                    <Tooltip content={<CustomTooltip />} />

                    {attributeNames.map((_className, indexClass) => (
                        <Bar
                            key={_className}
                            dataKey={_className}
                            stackId={!props.stacked ? indexClass +1 : 1}
                            activeBar={<Rectangle fill="#808080" stroke="#F0FFF0" />}
                            type="monotone"
                            onClick={handleBarClick}
                            stroke={defaultPalette[indexClass % defaultPalette.length]}
                            fill={defaultPalette[indexClass % defaultPalette.length]}
                        >
                            {/* <LabelList dataKey={_className} position="top" /> */}
                        </Bar>
                    ))}
                    {tendencyAttributeNames.map((_tendencyName, indexTendency) => (
                        <Line
                            key={_tendencyName}
                            type="monotone"
                            dataKey={_tendencyName}
                            stroke={internalTendencyPalette[indexTendency % internalTendencyPalette.length]}
                            fill={internalTendencyPalette[indexTendency % internalTendencyPalette.length]}
                        />
                    ))}
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );


};
export default BarLineAreaComposedChart;
