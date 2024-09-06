
import { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { IOrganicaPercentual } from './ISAgro/types';

interface OrganicasPercentualAreaChartProps {
  organicas: IOrganicaPercentual[] | null;
  width: number;
  height: number;
}

export default class OrganicasPercentualAreaChart extends PureComponent<OrganicasPercentualAreaChartProps> {

  render() {
      const organicas = this.props.organicas ?? [];
      console.log(`getGroupedbySetor: [grouped organicas] ${JSON.stringify(organicas)}`);
    const width = this.props.width ?? 500;
    const height = this.props.height ?? 400;
    return (<AreaChart
      width={width}
      height={height}
      data={organicas}
      stackOffset="expand"
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0
      }}
    >
      <CartesianGrid strokeDasharray="4 4" />
      <XAxis dataKey="year" />
      {/* <YAxis tickFormatter={toPercent} /> */}
      {/* <Tooltip content={renderTooltipContent} /> */}
        <Area type="monotone" dataKey="hortalicas" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="fruticultura" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
        <Area type="monotone" dataKey="pastagem" stackId="1" stroke="#ffc658" fill="#ffc658" />
        <Area type="monotone" dataKey="grao" stackId="1" stroke="#f4f600" fill="#f4f600" />
    </AreaChart>)
  }
}
