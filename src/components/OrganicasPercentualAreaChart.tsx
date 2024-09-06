import { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { IOrganicaPercentual } from "./ISAgro/types";

interface OrganicasPercentualAreaChartProps {
  organicas: IOrganicaPercentual[] | null;
  width: number;
  height: number;
}

export default class OrganicasPercentualAreaChart extends PureComponent<OrganicasPercentualAreaChartProps> {
  toPercent(decimal: number, fixed: number = 0) {
    return `${(decimal * 100).toFixed(fixed)}%`;
  }

  getPercent = (value: number, total: number) => {
    const ratio = total > 0 ? value / total : 0;
    return this.toPercent(ratio, 2);
  };

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
              {`${entry.name}: ${entry.value}(${this.getPercent(
                entry.value,
                total
              )})`}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  render() {
    const organicas = this.props.organicas ?? [];
    console.log(
      `getGroupedbySetor: [grouped organicas] ${JSON.stringify(organicas, null, 2)}`
    );
    const width = this.props.width ?? 500;
    const height = this.props.height ?? 400;
    return (
      <AreaChart
        width={width}
        height={height}
        data={organicas}
        stackOffset="expand"
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={this.toPercent} />
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
          stroke="#f4f600"
          fill="#f4f600"
        />
      </AreaChart>
    );
  }
}
