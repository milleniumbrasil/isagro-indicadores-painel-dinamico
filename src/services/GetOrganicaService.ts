
// src/services/GetOrganicaService.ts

import { IOrganica } from "../components/ISAgro/types";

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
      { data: new Date(1990, 0, 1), area: 500, setor: "grão" },
      { data: new Date(1991, 0, 1), area: 520, setor: "hortaliças" },
      { data: new Date(1992, 0, 1), area: 540, setor: "fruticultura" },
      { data: new Date(1993, 0, 1), area: 560, setor: "pastagem" },
      { data: new Date(1994, 0, 1), area: 580, setor: "grão" },
      { data: new Date(1995, 0, 1), area: 600, setor: "hortaliças" },
      { data: new Date(1996, 0, 1), area: 620, setor: "fruticultura" },
      { data: new Date(1997, 0, 1), area: 640, setor: "pastagem" },
      { data: new Date(1998, 0, 1), area: 660, setor: "grão" },
      { data: new Date(1999, 0, 1), area: 680, setor: "hortaliças" },
      { data: new Date(2000, 0, 1), area: 700, setor: "fruticultura" },
      { data: new Date(2001, 0, 1), area: 720, setor: "pastagem" },
      { data: new Date(2002, 0, 1), area: 740, setor: "grão" },
      { data: new Date(2003, 0, 1), area: 760, setor: "hortaliças" },
      { data: new Date(2004, 0, 1), area: 780, setor: "fruticultura" },
      { data: new Date(2005, 0, 1), area: 800, setor: "pastagem" },
      { data: new Date(2006, 0, 1), area: 820, setor: "grão" },
      { data: new Date(2007, 0, 1), area: 840, setor: "hortaliças" },
      { data: new Date(2008, 0, 1), area: 860, setor: "fruticultura" },
      { data: new Date(2009, 0, 1), area: 880, setor: "pastagem" },
      { data: new Date(2010, 0, 1), area: 900, setor: "grão" },
      { data: new Date(2011, 0, 1), area: 920, setor: "hortaliças" },
      { data: new Date(2012, 0, 1), area: 940, setor: "fruticultura" },
      { data: new Date(2013, 0, 1), area: 960, setor: "pastagem" },
      { data: new Date(2014, 0, 1), area: 980, setor: "grão" },
      { data: new Date(2015, 0, 1), area: 1000, setor: "hortaliças" },
      { data: new Date(2016, 0, 1), area: 1020, setor: "fruticultura" },
      { data: new Date(2017, 0, 1), area: 1040, setor: "pastagem" },
      { data: new Date(2018, 0, 1), area: 1060, setor: "grão" },
      { data: new Date(2019, 0, 1), area: 1080, setor: "hortaliças" },
    ] as T;
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