
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
    const total = payload.reduce(
      (result: number, entry: any) => result + entry.value,
      0
    );
    return (
      <div className="customized-tooltip-content">
        <p className="total">{`${label} (Total: ${total})`}</p>
        <ul className="list">
          {payload.map((entry: any, index: number) => (
            <li key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value} `}
            </li>
          ))}
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
          <Tooltip content={this.renderTooltipContent} />
        <Area
          type="monotone"
          dataKey="hortalicas"
          stackId="1"
          stroke="#8884d8"
          fill="#8884d8"
        />
        <Area
          type="monotone"
          dataKey="fruticultura"
          stackId="1"
          stroke="#82ca9d"
          fill="#82ca9d"
        />
        <Area
          type="monotone"
          dataKey="pastagem"
          stackId="1"
          stroke="#ffc658"
          fill="#ffc658"
        />
        <Area
          type="monotone"
          dataKey="grao"
          stackId="1"
          stroke="blue"
          fill="blue"
        />
        </AreaChart>
    );
  }
}
