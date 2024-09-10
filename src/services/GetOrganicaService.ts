
// src/services/GetOrganicaService.ts

import { IPercentualAreaChart, IOrganicaBySetor } from "../components/ISAgro/types";

interface RequestHeaders {
  [key: string]: string;
}

class GetOrganicaService {
  private baseURL: string;
  private headers: RequestHeaders;

  constructor(baseURL: string = process.env.REACT_APP_API_BASE_URL || "", headers: RequestHeaders = { accept: '*/*' }) {
    this.baseURL = baseURL;
    this.headers = headers;
  }

  public async getData(): Promise<Object[]> {
    return [
      { period: '1990', area: 100, setor: "grão" },
      { period: '1990', area: 150, setor: "hortaliças" },
      { period: '1990', area: 50, setor: "fruticultura" },
      { period: '1990', area: 10, setor: "pastagem" },
      
      { period: '1991', area: 250, setor: "grão" },
      { period: '1991', area: 350, setor: "hortaliças" },
      { period: '1991', area: 200, setor: "fruticultura" },
      { period: '1991', area: 100, setor: "pastagem" },
      
      { period: '1992', area: 400, setor: "grão" },
      { period: '1992', area: 500, setor: "hortaliças" },
      { period: '1992', area: 450, setor: "fruticultura" },
      { period: '1992', area: 250, setor: "pastagem" },
    
      { period: '1993', area: 800, setor: "grão" },
      { period: '1993', area: 750, setor: "hortaliças" },
      { period: '1993', area: 800, setor: "fruticultura" },
      { period: '1993', area: 450, setor: "pastagem" },
    
      { period: '1994', area: 900, setor: "grão" },
      { period: '1994', area: 900, setor: "hortaliças" },
      { period: '1994', area: 1100, setor: "fruticultura" },
      { period: '1994', area: 900, setor: "pastagem" },
      
      { period: '1995', area: 1200, setor: "grão" },
      { period: '1995', area: 1300, setor: "hortaliças" },
      { period: '1995', area: 1450, setor: "fruticultura" },
      { period: '1995', area: 9000, setor: "pastagem" }
    ] as Object[];
  }

  public async getPercentualData(): Promise<IPercentualAreaChart[]> {
    return [
      { period: '1990', area: 100 },
      { period: '1990', area: 150 },
      { period: '1990', area: 50 },
      { period: '1990', area: 10 },
      { period: '1991', area: 250 },
      { period: '1991', area: 350 },
      { period: '1991', area: 200 },
      { period: '1991', area: 100 },
      { period: '1992', area: 400 },
      { period: '1992', area: 500 },
      { period: '1992', area: 450 },
      { period: '1992', area: 250 },
      { period: '1993', area: 800 },
      { period: '1993', area: 750 },
      { period: '1993', area: 800 },
      { period: '1993', area: 450 },
      { period: '1994', area: 900 },
      { period: '1994', area: 900 },
      { period: '1994', area: 1100 },
      { period: '1994', area: 900 },
      { period: '1995', area: 1200 },
      { period: '1995', area: 1300 },
      { period: '1995', area: 1450 },
      { period: '1995', area: 900},
    ] as IPercentualAreaChart[];
  }
  
  public async getGroupedbySetorAsPercentual(): Promise<IPercentualAreaChart[] | { error: string }> {
    const items: IPercentualAreaChart[] = await this.getPercentualData();
    
    if (Array.isArray(items)) {
      const groupedByYear = items.reduce((acc, item: IPercentualAreaChart) => {
        const year: string = item.period;
  
        if (!acc[year]) {
          acc[year] = 0; // Inicializa o total de área como 0 para o ano
        }
  
        acc[year] += item.area; // Soma a área para o ano correspondente
  
        return acc;
      }, {} as { [year: string]: number }); // O acumulador contém apenas o total de área por ano
      
      // Mapeia para o formato da interface IPercentualAreaChart
      const result: IPercentualAreaChart[] = Object.keys(groupedByYear).map(year => {
        return {
          period: year, // 'period' corresponde ao ano como string
          area: groupedByYear[year], // 'area' é o total acumulado de áreas
        };
      });
  
      return result; // Retorna um array de objetos que seguem a interface IPercentualAreaChart
    } else {
      return { error: "Invalid data" };
    }
  }

  public async getGroupedbySetor(): Promise<IOrganicaBySetor[] | { error: string }> {
    const items: IPercentualAreaChart[] = await this.getPercentualData();
    if (Array.isArray(items)) {
      // Agrupar os itens por ano
      const groupedByYear = items.reduce((acc, item) => {
        const year = item.period;
        
        // Inicializar o ano se ele não existir ainda no agrupamento
        if (!acc[year]) {
          acc[year] = {
            hortalicas: 0,
            fruticultura: 0,
            pastagem: 0,
            grao: 0,
            totalArea: 0,
          };
        }
  
        // Atualizar a área total do ano
        acc[year].totalArea += item.area;
  
        return acc;
      }, {} as { [year: string]: { hortalicas: number, fruticultura: number, pastagem: number, grao: number, totalArea: number } });
      
      // Retornar os valores absolutos de cada setor por ano
      const result: IOrganicaBySetor[] = Object.keys(groupedByYear).map(year => {
        return {
          period: year,
          hortalicas: groupedByYear[Number(year)].hortalicas,
          fruticultura: groupedByYear[Number(year)].fruticultura,
          pastagem: groupedByYear[Number(year)].pastagem,
          grao: groupedByYear[Number(year)].grao,
        };
      });
  
      return result;
    } else {
      return { error: "Invalid data" };
    }
  }

}

export default GetOrganicaService;