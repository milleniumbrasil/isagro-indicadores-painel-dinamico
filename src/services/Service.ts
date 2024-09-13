import axios, { AxiosResponse } from "axios";

interface RequestHeaders {
  [key: string]: string;
}

class Service {
  protected baseURL: string;
  protected headers: RequestHeaders;

  constructor(
    baseURL: string = process.env.REACT_APP_API_BASE_URL || "",
    headers: RequestHeaders = { accept: "*/*" }
  ) {
    this.baseURL = baseURL;
    this.headers = headers;
    if (!this.baseURL) {
      throw new Error("Base URL não pode ser vazia");
    }
  }

  // Método genérico para requisições GET
  protected async get<T>(endpoint: string): Promise<T> {
    const targetURL = `${this.baseURL}${endpoint}`;
    try {
      const response: AxiosResponse<T> = await axios.get<T>(targetURL, {
        headers: this.headers,
      });
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        throw new Error(
          `A resposta de ${targetURL} não é um array. ${JSON.stringify(response.data)}`
        );
      }
    } catch (error) {
      throw new Error(`Erro ao realizar a requisição para ${endpoint}: ${error}`);
    }
  }
}

export default Service;
