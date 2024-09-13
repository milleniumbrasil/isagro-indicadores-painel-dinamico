// src/components/PercentualAreaChart.tsx

import { PureComponent, useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { IPercentualAreaChart } from '../types';

interface PercentualAreaChartProps {
  data: IPercentualAreaChart[] | undefined;
  dataKey?: string;
  valueLabel?: string;
  width?: number;
  height?: number;
  strokeColor?: string;
  fillColor?: string;
}

const PercentualAreaChart: React.FC<PercentualAreaChartProps> = (props) => {

  const normalizeData = (_data: IPercentualAreaChart[]|undefined): IPercentualAreaChart[] => {
    if (!_data) {
      throw new Error('Data is undefined for rendering the chart');
    };
    const maxArea = Math.max(..._data.map(i => i.value)); // Identifica o valor máximo
    const result = _data.map(e => ({
      ...e,
      value: (e.value / maxArea) * 100 // Normaliza os valores de 'area' para percentuais
    }));
    return result;
  }

  const [internalValueLabel, setInternalInternalValueLabel] = useState<string>(props.valueLabel ?? 'Valor');
  const [internalData, setInternalData ] = useState<IPercentualAreaChart[] | undefined>(normalizeData(props.data));
  const [internalDataKey, setInternalDataKey ] = useState< string>(props.dataKey ?? 'period');
  const [internalWidth, setInternalWidth ] = useState< number>(props.width ?? 800);
  const [internalHeight, setInternalHeight ] = useState< number>(props.height ?? 1200);
  const [internalStrokeColor, setInternalStrockeColor ] = useState< string>(props.strokeColor ?? '#228B22');
  const [internalFillColor, setInternalFillColor ] = useState< string>(props.fillColor ?? '#228B22');
  const [attributeNames, setAttributeNames] = useState<string[]>(Array.from(new Set(internalData?.flatMap(Object.keys))).filter(key => key !== internalDataKey) ?? []);

  const legendFormatter = (value: any, entry: any, index: any): string => {
    const legend = internalValueLabel? internalValueLabel : value;
    return `${legend.charAt(0).toUpperCase()}${legend.slice(1)}`;
  }

  const tickFormatter = (decimal: number = 0, fixed: number = 1): string => {
    return `${Math.round(decimal)}%`;
  }

  const renderTooltipContent = (o: any) => {
    const { payload = [] } = o;

    return (
      <div
      className="customized-tooltip-content"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px', fontFamily: 'Arial, sans-serif' }}
      >
        <ul className="list" style={{ listStyleType: 'none', padding: 0, fontSize: '12px' }}>
          {payload.map((entry: any, index: number) => {
            const fontColor = 'black';
            if (entry.name !== internalDataKey && attributeNames.includes(entry.name) && typeof entry.value === 'number') {
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
  }


    return (
        <div style={{ width: '100%', height: internalHeight }}>
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
              <XAxis dataKey={internalDataKey} />
              <YAxis tickFormatter={tickFormatter} ticks={[0, 25, 50, 75, 100]}/>
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
        </div>
    );

}

export default PercentualAreaChart;
