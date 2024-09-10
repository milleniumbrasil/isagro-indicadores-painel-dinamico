
// src/components/OrganicaAreaChart.tsx

import { PureComponent } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { IPercentualAreaChart } from './ISAgro/types';

interface OrganicaAreaChartProps {
  organicas: IPercentualAreaChart[] | null;
  width: number;
  height: number;
}

export default class OrganicaAreaChart extends PureComponent<OrganicaAreaChartProps> {

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
    const width = this.props.width ?? 500;
    const height = this.props.height ?? 400;
    return (
        <AreaChart
          width={width}
          height={height}
          data={organicas}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="area" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
    );
  }
}
