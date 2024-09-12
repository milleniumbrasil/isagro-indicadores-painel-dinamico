// src/components/PercentualAreaChart.tsx

import { PureComponent } from 'react';
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
  data: IPercentualAreaChart[] | null;
  dataKey?: string;
  valueLabel?: string;
  width?: number;
  height?: number;
  strokeColor?: string;
  fillColor?: string;
}

export default class PercentualAreaChart extends PureComponent<PercentualAreaChartProps> {
  
  private attributeNames:string[] = [''];
  private width: number = 0;
  private height: number = 0;
  private dataKey: string = '';
  private valueLabel: string = 'Valor';
  private data: Object[] = [];
  private strokeColor: string = "#228B22";
  private fillColor: string = "#228B22";
  
  constructor(props: PercentualAreaChartProps) {
    super(props);
    this.renderTooltipContent = this.renderTooltipContent.bind(this); 
    this.width = this.props.width ?? 800;
    this.height = this.props.height ?? 1200;
    this.dataKey = this.props.dataKey ?? 'period';
    this.valueLabel = this.props.valueLabel ?? 'Valor';
    this.data = this.props.data ?? [];
  }
  
  legendFormatter(value: any, entry: any, index: any): string {
    const legend = this.valueLabel? this.valueLabel : value;
    return `${legend.charAt(0).toUpperCase()}${legend.slice(1)}`;
  }

  tickFormatter(decimal: number = 0, fixed: number = 1): string {
    return `${Math.round(decimal)}%`;
  }

  normalizeData(data: IPercentualAreaChart[]): IPercentualAreaChart[] {

    const maxArea = Math.max(...data.map(item => item.value)); // Identifica o valor máximo
    const result = data.map(item => ({
      ...item,
      value: (item.value / maxArea) * 100 // Normaliza os valores de 'area' para percentuais
    }));
    
    return result;
  }

  renderTooltipContent(o: any) {
    const { payload = [] } = o;  
    
    return (
      <div
      className="customized-tooltip-content"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px', fontFamily: 'Arial, sans-serif' }} 
      >
        <ul className="list" style={{ listStyleType: 'none', padding: 0, fontSize: '12px' }}>
          {payload.map((entry: any, index: number) => {
            const fontColor = 'black'; 
            if (entry.name !== this.dataKey && this.attributeNames.includes(entry.name) && typeof entry.value === 'number') {
              return ( 
                  <li key={`item-${index}`} style={{ color: fontColor }}>
                    {this.valueLabel} {entry.value}
                  </li>        
              );
            } 
            return null;
          })}
        </ul>
      </div>
    );
  }
  
  render() {
    this.width = this.props.width ?? 800;
    this.height = this.props.height ?? 1200;
    this.strokeColor = this.props.strokeColor ?? "#228B22";
    this.fillColor = this.props.fillColor ?? "#228B22";
    this.dataKey = this.props.dataKey ?? 'period';
    this.data = this.normalizeData(this.props.data ?? []);
    this.valueLabel = this.props.valueLabel ?? 'Valor';
    this.attributeNames = Array.from(new Set(this.data.flatMap(Object.keys))).filter(key => key !== this.dataKey);
    
    return (
        <div style={{ width: '100%', height: this.height }}>
          <ResponsiveContainer>
            <AreaChart
              width={this.width}
              height={this.height}
              data={this.data}
              margin={{
                top: 10,
                right: 50,
                left: 10,
                bottom: 10,
              }}
              style={{ fontSize: 8 }}
            >
              <CartesianGrid strokeDasharray="0" />
              <XAxis dataKey={this.dataKey} />
              <YAxis tickFormatter={this.tickFormatter} ticks={[0, 25, 50, 75, 100]}/>
              <Legend formatter={this.legendFormatter} />
              <Tooltip content={this.renderTooltipContent} />
              {this.attributeNames.map((item, index) => (
                <Area
                  key={item}
                  type="monotone"
                  dataKey={item}
                  stackId="1"
                  stroke={this.strokeColor}
                  fill={this.fillColor}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
    );
  }
}