
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
      { year: 1990, area: 500, setor: "grão" },
      { year: 1991, area: 520, setor: "hortaliças" },
      { year: 1992, area: 540, setor: "fruticultura" },
      { year: 1993, area: 560, setor: "pastagem" },
      { year: 1994, area: 580, setor: "grão" },
      { year: 1995, area: 600, setor: "hortaliças" },
      { year: 1996, area: 620, setor: "fruticultura" },
      { year: 1997, area: 640, setor: "pastagem" },
      { year: 1998, area: 660, setor: "grão" },
      { year: 1999, area: 680, setor: "hortaliças" },
      { year: 2000, area: 700, setor: "fruticultura" },
      { year: 2001, area: 720, setor: "pastagem" },
      { year: 2002, area: 740, setor: "grão" },
      { year: 2003, area: 760, setor: "hortaliças" },
      { year: 2004, area: 780, setor: "fruticultura" },
      { year: 2005, area: 800, setor: "pastagem" },
      { year: 2006, area: 820, setor: "grão" },
      { year: 2007, area: 840, setor: "hortaliças" },
      { year: 2008, area: 860, setor: "fruticultura" },
      { year: 2009, area: 880, setor: "pastagem" },
      { year: 2010, area: 900, setor: "grão" },
      { year: 2011, area: 920, setor: "hortaliças" },
      { year: 2012, area: 940, setor: "fruticultura" },
      { year: 2013, area: 960, setor: "pastagem" },
      { year: 2014, area: 980, setor: "grão" },
      { year: 2015, area: 1000, setor: "hortaliças" },
      { year: 2016, area: 1020, setor: "fruticultura" },
      { year: 2017, area: 1040, setor: "pastagem" },
      { year: 2018, area: 1060, setor: "grão" },
      { year: 2019, area: 1080, setor: "hortaliças" },
    ] as T;
  }
  
  public async getGroupedbySetorAsPercentual(items: IOrganica[]): Promise<IOrganicaPercentual[] | { error: string }> {  
    console.log(`getGroupedbySetorAsPercentual [items]: ${JSON.stringify(items, null, 2)}`);
    
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
        } else if (item.setor === "fruticultura") {
          acc[year].fruticultura += item.area;
        } else if (item.setor === "pastagem") {
          acc[year].pastagem += item.area;
        } else if (item.setor === "grão") {
          acc[year].grao += item.area;
        }
  
        return acc;
      }, {} as { [year: number]: { hortalicas: number, fruticultura: number, pastagem: number, grao: number, totalArea: number } });
      
      console.log(`getGroupedbySetorAsPercentual [grouped]: ${JSON.stringify(groupedByYear, null, 2)}`);
      
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
  
      console.log(`getGroupedbySetorAsPercentual [percentual result]: ${JSON.stringify(result, null, 2)}`);
      return result;
    } else {
      return { error: "Data not available" };
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