
// src/services/GetOrganicaService.ts

import axios, { AxiosResponse } from "axios";
import { IPercentualAreaChart, IStackedAreaChart } from "../components/ISAgro/types";

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

  public async getData(): Promise<IStackedAreaChart[]> {
    return [
      { period: '1990', entry: ["grão", 100] },
      { period: '1990', entry: ["hortaliças", 150] },
      { period: '1990', entry: ["fruticultura", 50] },
      { period: '1990', entry: ["pastagem", 10] },
      
      { period: '1991', entry: ["grão", 250] },
      { period: '1991', entry: ["hortaliças", 350] },
      { period: '1991', entry: ["fruticultura", 200] },
      { period: '1991', entry: ["pastagem", 100] },
      
      { period: '1992', entry: ["grão", 400] },
      { period: '1992', entry: ["hortaliças", 500] },
      { period: '1992', entry: ["fruticultura", 450] },
      { period: '1992', entry: ["pastagem", 250] },
    
      { period: '1993', entry: ["grão", 800] },
      { period: '1993', entry: ["hortaliças", 750] },
      { period: '1993', entry: ["fruticultura", 800] },
      { period: '1993', entry: ["pastagem", 450] },
    
      { period: '1994', entry: ["grão", 900] },
      { period: '1994', entry: ["hortaliças", 900] },
      { period: '1994', entry: ["fruticultura", 1100] },
      { period: '1994', entry: ["pastagem", 900] },
      
      { period: '1995', entry: ["grão", 1200] },
      { period: '1995', entry: ["hortaliças", 1300] },
      { period: '1995', entry: ["fruticultura", 1450] },
      { period: '1995', entry: ["pastagem", 9000] }
    ] as IStackedAreaChart[];
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