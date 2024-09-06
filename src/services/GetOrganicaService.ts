
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
      { "year": 1990, "area": 500, "setor": "grão" },
      { "year": 1990, "area": 520, "setor": "hortaliças" },
      { "year": 1990, "area": 540, "setor": "fruticultura" },
      { "year": 1990, "area": 560, "setor": "pastagem" },
      
      { "year": 1991, "area": 600, "setor": "grão" },
      { "year": 1991, "area": 620, "setor": "hortaliças" },
      { "year": 1991, "area": 640, "setor": "fruticultura" },
      { "year": 1991, "area": 660, "setor": "pastagem" },
      
      { "year": 1992, "area": 700, "setor": "grão" },
      { "year": 1992, "area": 720, "setor": "hortaliças" },
      { "year": 1992, "area": 740, "setor": "fruticultura" },
      { "year": 1992, "area": 760, "setor": "pastagem" },
    
      { "year": 1993, "area": 800, "setor": "grão" },
      { "year": 1993, "area": 820, "setor": "hortaliças" },
      { "year": 1993, "area": 840, "setor": "fruticultura" },
      { "year": 1993, "area": 860, "setor": "pastagem" },
    
      { "year": 1994, "area": 900, "setor": "grão" },
      { "year": 1994, "area": 920, "setor": "hortaliças" },
      { "year": 1994, "area": 940, "setor": "fruticultura" },
      { "year": 1994, "area": 960, "setor": "pastagem" },
      
      { "year": 1995, "area": 1000, "setor": "grão" },
      { "year": 1995, "area": 1020, "setor": "hortaliças" },
      { "year": 1995, "area": 1040, "setor": "fruticultura" },
      { "year": 1995, "area": 1060, "setor": "pastagem" }
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
        const yearData = groupedByYear[Number(year)];
        const { hortalicas, fruticultura, pastagem, grao, totalArea } = yearData;
  
        return {
          year: Number(year),
          hortalicas: (hortalicas / totalArea) * 100 || 0, // Calcular percentual
          fruticultura: (fruticultura / totalArea) * 100 || 0,
          pastagem: (pastagem / totalArea) * 100 || 0,
          grao: (grao / totalArea) * 100 || 0,
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