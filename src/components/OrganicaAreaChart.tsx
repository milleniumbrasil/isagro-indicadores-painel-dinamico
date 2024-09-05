
// src/components/OrganicaAreaChart.tsx

import { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IOrganica } from './ISAgro/types';

interface OrganicaAreaChartProps {
  organicas: IOrganica[] | null;  
}

export default class OrganicaAreaChart extends PureComponent<OrganicaAreaChartProps> {

  render() {
  
    const organicas = this.props.organicas ?? [];

    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={organicas}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dt" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="area" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}
