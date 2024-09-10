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
import { IStackedAreaChart } from './ISAgro/types';

interface PercentualAreaChartProps {
  data: IStackedAreaChart[] | null;
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
    this.width = this.props.width ?? 800;
    this.height = this.props.height ?? 1200;
    this.dataKey = this.props.dataKey ?? 'period';
    this.valueLabel = this.props.valueLabel ?? 'Valor';
    this.data = this.props.data ?? [];
  }
  
  tickFormatter(decimal: number = 0, fixed: number = 1): string {
    return `${Math.round(decimal)}`;
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

  normalizeData(entries: IStackedAreaChart[]): { [key: string]: any }[] {
  
    // Agrupa os dados por 'period' e calcula o valor total internamente
    const groupedData = entries.reduce((acc, entry) => {
      const { period, entry: dataEntry } = entry;
  
      // Verifica se 'dataEntry' tem um valor válido e é um array
      if (!dataEntry || !Array.isArray(dataEntry) || dataEntry.length !== 2) {
        console.error(`Invalid entry found for period ${period}:`, dataEntry);
        return acc; // Pula este item se 'dataEntry' for inválido
      }
  
      const [label, value] = dataEntry; // Desestruturação do label e value
  
      // Verifica se o período já existe no acumulador
      if (!acc[period]) {
        acc[period] = { period }; // Inicializa um objeto com a chave do período, sem o 'total'
      }
  
      // Adiciona o valor correspondente ao 'label'
      acc[period][label] = value;
  
      return acc;
    }, {} as { [key: string]: { [label: string]: any } });
  
    // Converte o resultado agrupado em um array
    const result = Object.values(groupedData);

    // Calcula o valor máximo sem adicionar o campo 'total'
    const maxTotal = Math.max(...result.map(d => 
      Object.values(d).reduce((sum, value) => 
        typeof value === 'number' ? sum + value : sum, 0)
    ));

    // Divide o valor máximo em 4 partes
    const step = Math.ceil(maxTotal / 4);
    this.dynamicTicks = [0, step, step * 2, step * 3, step * 4]; // Definindo os ticks dinâmicos

    return result;
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
    console.log(`Data: ${JSON.stringify(this.data)}`);
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
              <Legend />
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