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
import { IPercentualAreaChart } from './ISAgro/types';

interface PercentualAreaChartProps {
  data: IPercentualAreaChart[] | null;
  dataKey: string;
  width: number;
  height: number;
}

export default class PercentualAreaChart extends PureComponent<PercentualAreaChartProps> {
  
  private static COLORS = ["#32CD32", "#228B22", "#66CDAA", "#006400", "#a4de6c"];

  private attributeNames:string[] = [''];
  private width: number = 0;
  private height: number = 0;
  private dataKey: string = '';
  private data: Object[] = [];
  
  constructor(props: PercentualAreaChartProps) {
    super(props);
    this.renderTooltipContent = this.renderTooltipContent.bind(this); 
    this.width = this.props.width;
    this.height = this.props.height;
    this.dataKey = this.props.dataKey;
    this.data = this.props.data ?? [];
  }
  
  tickFormatter(decimal: number = 0, fixed: number = 1): string {
    return `${(decimal).toFixed(fixed)}%`;
  }

  normalizeData(data: IPercentualAreaChart[]): IPercentualAreaChart[] {
    const maxArea = Math.max(...data.map(item => item.area)); // Identifica o valor máximo
    return data.map(item => ({
      ...item,
      area: (item.area / maxArea) * 100 // Normaliza os valores de 'area' para percentuais
    }));
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
                    ${entry.value}
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
    this.width = this.props.width;
    this.height = this.props.height;
    this.dataKey = this.props.dataKey;
    this.data = this.normalizeData(this.props.data ?? []);
    this.attributeNames = Array.from(new Set(this.data.flatMap(Object.keys))).filter(key => key !== this.dataKey);
    console.log(`Data: ${JSON.stringify(this.data)}`);
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
              <YAxis tickFormatter={this.tickFormatter} ticks={[0, 25, 50, 100]}/>
              <Legend />
              <Tooltip content={this.renderTooltipContent} />
              {this.attributeNames.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={PercentualAreaChart.COLORS[index % PercentualAreaChart.COLORS.length]}
                  fill={PercentualAreaChart.COLORS[index % PercentualAreaChart.COLORS.length]}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
    );
  }
}