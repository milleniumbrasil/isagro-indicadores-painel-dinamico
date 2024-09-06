
// src/components/OrganicaAreaChartTest.tsx

import { PureComponent } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { IOrganicaPercentual } from './ISAgro/types';

interface OrganicaAreaChartTestProps {
  organicas: IOrganicaPercentual[] | null;
  width: number;
  height: number;
}

export default class OrganicaAreaChartTest extends PureComponent<OrganicaAreaChartTestProps> {

  renderTooltipContent(o: any) {
    const { payload = [], label } = o;  
    return (
      <div
        className="customized-tooltip-content"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: '10px', borderRadius: '5px', fontFamily: 'Arial, sans-serif' }} 
      >
        <ul className="list" style={{ listStyleType: 'none', padding: 0, fontSize: '12px' }}>
          {payload.map((entry: any, index: number) => {
            const fontColor = 'black'; 
  
            return (
              <li key={`item-${index}`} style={{ color: fontColor }}>
                {`${entry.name}: ${entry.value} `}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  render() {
    const organicas = this.props.organicas ?? [];
    const width = this.props.width;
    const height = this.props.height;
    return (
        <AreaChart
          width={width}
          height={height}
          data={organicas}
          margin={{
            top: 10,
            right: 50,
            left: 10,
            bottom: 10,
          }}
          style={{ fontSize: 8 }}
        >
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(decimal: number = 0, fixed: number = 1) => `${(decimal).toFixed(fixed)}%`} />
          <Tooltip content={this.renderTooltipContent} /><Area
            type="monotone"
            dataKey="hortalicas"
            stackId="1"
            stroke="#32CD32" // LimeGreen
            fill="#32CD32"
          />
          <Area
            type="monotone"
            dataKey="fruticultura"
            stackId="1"
            stroke="#228B22" // ForestGreen
            fill="#228B22"
          />
          <Area
            type="monotone"
            dataKey="pastagem"
            stackId="1"
            stroke="#66CDAA" // MediumAquamarine
            fill="#66CDAA"
          />
          <Area
            type="monotone"
            dataKey="grao"
            stackId="1"
            stroke="#006400" // DarkGreen
            fill="#006400"
          />
        </AreaChart>
    );
  }
}
