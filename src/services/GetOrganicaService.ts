
// src/services/GetOrganicaService.ts

import axios, { AxiosResponse } from "axios";
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
  
  public async getOrganicasAsPercentual(): Promise<IPercentualAreaChart[] | { error: string }> {
    try {
      console.log("this.baseURL", this.baseURL);
      console.log("process.env.REACT_APP_API_BASE_URL", process.env.REACT_APP_API_BASE_URL);
      const response: AxiosResponse<IPercentualAreaChart> = await axios.get<IPercentualAreaChart>(`${this.baseURL}/data/organicas/percentual`, {
      headers: this.headers
    });
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        throw new Error(`A resposta não é um array. ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      console.error("Erro ao realizar a requisição:", error);
      return { error: "Erro ao realizar a requisição" };
    }
  }
}

export default GetOrganicaService;