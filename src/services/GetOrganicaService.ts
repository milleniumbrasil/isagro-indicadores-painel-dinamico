
// src/services/GetOrganicaService.ts

import axios, { AxiosResponse } from "axios";
import { IPercentualAreaChart, IStackedAreaChart } from "../types";

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

  public async getData(): Promise<IStackedAreaChart[] | { error: string }> {
    try {
      console.log("this.baseURL", this.baseURL);
      console.log("process.env.REACT_APP_API_BASE_URL", process.env.REACT_APP_API_BASE_URL);
      const response: AxiosResponse<IStackedAreaChart> = await axios.get<IStackedAreaChart>(`${this.baseURL}/organicas/stacked`, {
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
  
  public async getOrganicasAsPercentual(): Promise<IPercentualAreaChart[] | { error: string }> {
    try {
      console.log("this.baseURL", this.baseURL);
      console.log("process.env.REACT_APP_API_BASE_URL", process.env.REACT_APP_API_BASE_URL);
      const response: AxiosResponse<IPercentualAreaChart> = await axios.get<IPercentualAreaChart>(`${this.baseURL}/organicas/percentual`, {
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