// src/services/GetDataService.ts

import axios, { AxiosResponse } from 'axios';

interface IDataService<T> {
  getData(): Promise<T | { error: string }>;
}

interface RequestHeaders {
  [key: string]: string;
}

class GetDataService<T> implements IDataService<T> {
  private baseURL: string;
  private headers: RequestHeaders;

  constructor(baseURL: string = process.env.REACT_APP_API_BASE_URL || "", headers: RequestHeaders = { accept: '*/*' }) {
    this.baseURL = baseURL;
    this.headers = headers;
  }

  public async getData(): Promise<T | { error: string }> {
    try {
        console.log("this.baseURL", this.baseURL);
        console.log("process.env.REACT_APP_API_BASE_URL", process.env.REACT_APP_API_BASE_URL);
        const response: AxiosResponse<T> = await axios.get<T>(`${this.baseURL}/data`, {
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

export default GetDataService;