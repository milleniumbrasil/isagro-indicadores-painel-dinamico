// src/services/GetDataService.ts

import Service from "./Service";

interface IDataService<T> {
  getData(): Promise<T | { error: string }>;
}

class GetNPKDataService<T> extends Service implements IDataService<T> {

  public async getData(): Promise<T | { error: string }> {
    // Usa o método `get` da classe BaseService, passando o endpoint necessário
    return this.get<T>("/data");
  }
}

export default GetNPKDataService;
