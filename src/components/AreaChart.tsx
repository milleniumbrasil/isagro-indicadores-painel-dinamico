// src/components/AreaChart.tsx

import { PureComponent } from 'react';
import {
  AreaChart as RechatsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { IStackedAreaChart } from '../types';

interface PercentualAreaChartProps {
  data: IStackedAreaChart[];
  dataKey?: string;
  valueLabel?: string;
  width?: number;
  height?: number;
  strokeColor?: string[];
  fillColor?: string[];
}

export default class AreaChart extends PureComponent<PercentualAreaChartProps> {

  // Paleta reorganizada do mais claro para o mais escuro
  public static palete = ["#a4de6c", "#66CDAA", "#32CD32", "#228B22", "#006400"];

  private attributeNames:string[] = [''];
  private width: number = 0;
  private height: number = 0;
  private dataKey: string = '';
  private valueLabel: string = 'Valor';
  private data: Object[] = [];
  private strokeColor: string[] = AreaChart.palete;
  private fillColor: string[] = AreaChart.palete;
  private dynamicTicks: number[] = [0];

  constructor(props: PercentualAreaChartProps) {
    super(props);
    this.renderTooltipContent = this.renderTooltipContent.bind(this);
    this.legendFormatter = this.legendFormatter.bind(this);
    this.width = this.props.width ?? 800;
    this.height = this.props.height ?? 1200;
    this.dataKey = this.props.dataKey ?? 'period';
    this.valueLabel = this.props.valueLabel ?? 'Valor';
    this.data = this.props.data ?? [];
  }

  tickFormatter(decimal: number = 0, fixed: number = 1): string {
    return `${Math.round(decimal as number)}`;
  }

  firstLetter2UpperCase(value: any): string {
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
  }

  legendFormatter(value: any, entry: any, index: any): string {
    return this.firstLetter2UpperCase(value);
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
                    {this.firstLetter2UpperCase(entry.name)} {entry.value}
                  </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    );
  }

  // Função para normalizar os dados
  normalizeData(entries: IStackedAreaChart[]): { [key: string]: any }[] {

    const normalizedDataSet: any[] = [];

    entries.forEach((entry) => {
      const { period, entry: dataEntry } = entry;
      const [label, value] = dataEntry;

      // buscar a última entry para o periodo e o label
      let normalized;
      normalized = normalizedDataSet.find((item) =>
        item.period === period &&
        !Object.keys(item).find((labelTarget) => labelTarget === label)
      );

      // se já existe uma entry para o periodo e label
      if (normalized) {
        normalized[label] = value;
      } else {
        const newNormalized: { [key: string]: any } = { "period": period };
        newNormalized[label] = value;
        normalizedDataSet.push(newNormalized);
      }
    });
    return normalizedDataSet;
  }

  // Função para calcular os steps
  calculateSteps(data: { [key: string]: any }[]): number[] {
    // Verifica se o array não está vazio
    if (data.length === 0) return [0, 0, 0, 0, 0];

    const maxTotal = Math.max(...data.map((d: { [key: string]: any }) => {
      const total = Object.values(d).reduce((sum: number, value: any) => {
        if (typeof value === 'number')
          return sum + value;
        else
          return sum;
      }, 0);
      return total;
    }));

    // Se maxTotal for 0, retorna steps com valores iniciais
    if (maxTotal === 0) return [0, 0, 0, 0, 0];

    const step = Math.ceil(maxTotal / 4);
    return [0, step, step * 2, step * 3, step * 4]; // Ticks dinâmicos
  }

  render() {
    this.width = this.props.width ?? 800;
    this.height = this.props.height ?? 1200;
    this.strokeColor = this.props.strokeColor ?? AreaChart.palete;
    this.fillColor = this.props.fillColor ?? AreaChart.palete;
    this.dataKey = this.props.dataKey ?? 'period';
    this.data = this.normalizeData(this.props.data ?? []);
    this.valueLabel = this.props.valueLabel ?? 'Valor';
    this.attributeNames = Array.from(new Set(this.data.flatMap(Object.keys))).filter(key => key !== this.dataKey);
    return (
        <div style={{ width: '100%', height: this.height }}>
          <ResponsiveContainer>
            <RechatsAreaChart
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
              <YAxis tickFormatter={this.tickFormatter} ticks={this.dynamicTicks}/>
              <Legend formatter={this.legendFormatter} />
              <Tooltip content={this.renderTooltipContent} />
              {this.attributeNames.map((item, index) => (
                <Area
                  key={item}
                  type="monotone"
                  dataKey={item}
                  stackId="1"
                  stroke={this.strokeColor[index % this.strokeColor.length]}
                  fill={this.fillColor[index % this.fillColor.length]}

                />
              ))}
            </RechatsAreaChart>
          </ResponsiveContainer>
        </div>
    );
  }
}
