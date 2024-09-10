// src/components/OrganicasPercentualAreaChart.tsx

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
import { IOrganica } from './ISAgro/types';

interface OrganicasPercentualAreaChartProps {
  organicas: IOrganica[] | null;
  dataKey: string;
  width: number;
  height: number;
}

export default class OrganicasPercentualAreaChart extends PureComponent<OrganicasPercentualAreaChartProps> {
  
  private static COLORS = ["#32CD32", "#228B22", "#66CDAA", "#006400", "#a4de6c"];

  private attributeNames:string[] = [''];
  private width: number = 0;
  private height: number = 0;
  private dataKey: string = '';
  private organicas: Object[] = [];
  
  constructor(props: OrganicasPercentualAreaChartProps) {
    super(props);
    this.renderTooltipContent = this.renderTooltipContent.bind(this); 
    this.width = this.props.width;
    this.height = this.props.height;
    this.dataKey = this.props.dataKey;
    this.organicas = this.props.organicas ?? [];
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
                    {`${entry.name}: ${entry.value} `}
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
    this.organicas = this.props.organicas ?? [];
    this.attributeNames = Array.from(new Set(this.organicas.flatMap(Object.keys))).filter(key => key !== this.dataKey);

    console.log(`Attribute names: ${this.attributeNames}`);

    return (
        <div style={{ width: '100%', height: this.height }}>
          <ResponsiveContainer>
            <AreaChart
              width={this.width}
              height={this.height}
              data={this.organicas}
              margin={{
                top: 10,
                right: 50,
                left: 10,
                bottom: 10,
              }}
              style={{ fontSize: 8 }}
            >
              <CartesianGrid strokeDasharray="1 1" />
              <XAxis dataKey={this.dataKey} />
              <YAxis tickFormatter={(decimal: number = 0, fixed: number = 1) => `${(decimal).toFixed(fixed)}%`} />
              <Legend />
              <Tooltip content={this.renderTooltipContent} />
              {this.attributeNames.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={OrganicasPercentualAreaChart.COLORS[index % OrganicasPercentualAreaChart.COLORS.length]}
                  fill={OrganicasPercentualAreaChart.COLORS[index % OrganicasPercentualAreaChart.COLORS.length]}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
    );
  }
}