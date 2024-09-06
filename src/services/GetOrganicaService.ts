
// src/services/GetOrganicaService.ts

import { IOrganica, IOrganicaPercentual } from "../components/ISAgro/types";

interface IOrganicaService<T> {
  getData(): Promise<T | { error: string }>;
}

interface RequestHeaders {
  [key: string]: string;
}

class GetOrganicaService<T> implements IOrganicaService<T> {
  private baseURL: string;
  private headers: RequestHeaders;

  constructor(baseURL: string = process.env.REACT_APP_API_BASE_URL || "", headers: RequestHeaders = { accept: '*/*' }) {
    this.baseURL = baseURL;
    this.headers = headers;
  }

  public async getData(): Promise<T | { error: string }> {
    return [
      { "year": 1990, "area": 100, "setor": "grão" },
      { "year": 1990, "area": 150, "setor": "hortaliças" },
      { "year": 1990, "area": 50, "setor": "fruticultura" },
      { "year": 1990, "area": 10, "setor": "pastagem" },
      
      { "year": 1991, "area": 250, "setor": "grão" },
      { "year": 1991, "area": 350, "setor": "hortaliças" },
      { "year": 1991, "area": 200, "setor": "fruticultura" },
      { "year": 1991, "area": 100, "setor": "pastagem" },
      
      { "year": 1992, "area": 400, "setor": "grão" },
      { "year": 1992, "area": 500, "setor": "hortaliças" },
      { "year": 1992, "area": 450, "setor": "fruticultura" },
      { "year": 1992, "area": 250, "setor": "pastagem" },
    
      { "year": 1993, "area": 800, "setor": "grão" },
      { "year": 1993, "area": 750, "setor": "hortaliças" },
      { "year": 1993, "area": 800, "setor": "fruticultura" },
      { "year": 1993, "area": 450, "setor": "pastagem" },
    
      { "year": 1994, "area": 900, "setor": "grão" },
      { "year": 1994, "area": 900, "setor": "hortaliças" },
      { "year": 1994, "area": 1100, "setor": "fruticultura" },
      { "year": 1994, "area": 900, "setor": "pastagem" },
      
      { "year": 1995, "area": 1200, "setor": "grão" },
      { "year": 1995, "area": 1300, "setor": "hortaliças" },
      { "year": 1995, "area": 1450, "setor": "fruticultura" },
      { "year": 1995, "area": 9000, "setor": "pastagem" }
    ] as T;
  }
  
  public async getGroupedbySetorAsPercentual(items: IOrganica[]): Promise<IOrganicaPercentual[] | { error: string }> {
    
    if (Array.isArray(items)) {
      // Agrupar os itens por ano
      const groupedByYear = items.reduce((acc, item) => {
        const year = item.year;
        
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
  
        // Adicionar a área ao setor correspondente
        if (item.setor === "hortaliças") {
          acc[year].hortalicas += item.area;
        }  
        if (item.setor === "fruticultura") {
          acc[year].fruticultura += item.area;
        }  
        if (item.setor === "pastagem") {
          acc[year].pastagem += item.area;
        }  
        if (item.setor === "grão") {
          acc[year].grao += item.area;
        }
  
        return acc;
      }, {} as { [year: number]: { hortalicas: number, fruticultura: number, pastagem: number, grao: number, totalArea: number } });
      
      // Calcular o percentual de cada setor por ano
      const result: IOrganicaPercentual[] = Object.keys(groupedByYear).map(year => {
        const totalArea = groupedByYear[Number(year)].totalArea;
        
        return {
          year: Number(year),
          hortalicas: Number((groupedByYear[Number(year)].hortalicas / totalArea).toFixed(2)), // Arredondando para 2 casas decimais
          fruticultura: Number((groupedByYear[Number(year)].fruticultura / totalArea).toFixed(2)),
          pastagem: Number((groupedByYear[Number(year)].pastagem / totalArea).toFixed(2)),
          grao: Number((groupedByYear[Number(year)].grao / totalArea).toFixed(2)),
        };
      });
  
      return result;
    } else {
     return { error: "Invalid data" };
    }
  }

  public async getByGrao(): Promise<IOrganica[] | { error: string }> {
    const items: IOrganica[] = await this.getData() as IOrganica[];
    if (Array.isArray(items)) {
      return items.filter((o: IOrganica) => o.setor === "grão");
    } else {
      return { error: "Data not available" };
    }
  }

  public async getByHortalicas(): Promise<IOrganica[] | { error: string }> {
    const items: IOrganica[] = await this.getData() as IOrganica[];
    if (Array.isArray(items)) {
      return items.filter((o: IOrganica) => o.setor === "hortaliças");
    } else {
      return { error: "Data not available" };
    }
  }

  public async getByPastagem(): Promise<IOrganica[] | { error: string }> {
    const items: IOrganica[] = await this.getData() as IOrganica[];
    if (Array.isArray(items)) {
      return items.filter((o: IOrganica) => o.setor === "pastagem");
    } else {
      return { error: "Data not available" };
    }
  }

  public async getByFruticultura(): Promise<IOrganica[] | { error: string }> {
    const items: IOrganica[] = await this.getData() as IOrganica[];
    if (Array.isArray(items)) {
      return items.filter((o: IOrganica) => o.setor === "fruticultura");
    } else {
      return { error: "Data not available" };
    }
  }
}

export default GetOrganicaService;