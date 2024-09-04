// src/services/GetStatesService.ts

interface IStatesService<T> {
  getData(): Promise<T | { error: string }>;
}

interface RequestHeaders {
  [key: string]: string;
}

class GetStatesService<T> implements IStatesService<T> {
  private baseURL: string;
  private headers: RequestHeaders;

  constructor(baseURL: string = process.env.REACT_APP_API_BASE_URL || "", headers: RequestHeaders = { accept: '*/*' }) {
    this.baseURL = baseURL;
    this.headers = headers;
  }

  public async getData(): Promise<T | { error: string }> {
    return [
      {"AC": "Acre"},
      {"AL": "Alagoas"},
      {"AP": "Amapá"},
      {"AM": "Amazonas"},
      {"BA": "Bahia"},
      {"CE": "Ceará"},
      {"DF": "Distrito Federal"},
      {"ES": "Espírito Santo"},
      {"GO": "Goiás"},
      {"MA": "Maranhão"},
      {"MT": "Mato Grosso"},
      {"MS": "Mato Grosso do Sul"},
      {"MG": "Minas Gerais"},
      {"PA": "Pará"},
      {"PB": "Paraíba"},
      {"PR": "Paraná"},
      {"PE": "Pernambuco"},
      {"PI": "Piauí"},
      {"RJ": "Rio de Janeiro"},
      {"RN": "Rio Grande do Norte"},
      {"RS": "Rio Grande do Sul"},
      {"RO": "Rondônia"},
      {"RR": "Roraima"},
      {"SC": "Santa Catarina"},
      {"SP": "São Paulo"},
      {"SE": "Sergipe"},
      {"TO": "Tocantins"}
    ] as T;
  }
}

export default GetStatesService;