// src/services/GetHttpClientStates.ts

interface IGetHttpClientStates<T> {
    getData(): Promise<T | { error: string }>;
}

interface RequestHeaders {
    [key: string]: string;
}

class GetHttpClientStates<T> implements IGetHttpClientStates<T> {
    private baseURL: string;
    private headers: RequestHeaders;

    constructor(baseURL: string = process.env.REACT_APP_API_BASE_URL || '', headers: RequestHeaders = { accept: '*/*' }) {
        this.baseURL = baseURL;
        this.headers = headers;
    }

    public async getData(): Promise<T> {
        return [
            { uf: 'AC', estado: 'Acre' },
            { uf: 'AL', estado: 'Alagoas' },
            { uf: 'AP', estado: 'Amapá' },
            { uf: 'AM', estado: 'Amazonas' },
            { uf: 'BA', estado: 'Bahia' },
            { uf: 'CE', estado: 'Ceará' },
            { uf: 'DF', estado: 'Distrito Federal' },
            { uf: 'ES', estado: 'Espírito Santo' },
            { uf: 'GO', estado: 'Goiás' },
            { uf: 'MA', estado: 'Maranhão' },
            { uf: 'MT', estado: 'Mato Grosso' },
            { uf: 'MS', estado: 'Mato Grosso do Sul' },
            { uf: 'MG', estado: 'Minas Gerais' },
            { uf: 'PA', estado: 'Pará' },
            { uf: 'PB', estado: 'Paraíba' },
            { uf: 'PR', estado: 'Paraná' },
            { uf: 'PE', estado: 'Pernambuco' },
            { uf: 'PI', estado: 'Piauí' },
            { uf: 'RJ', estado: 'Rio de Janeiro' },
            { uf: 'RN', estado: 'Rio Grande do Norte' },
            { uf: 'RS', estado: 'Rio Grande do Sul' },
            { uf: 'RO', estado: 'Rondônia' },
            { uf: 'RR', estado: 'Roraima' },
            { uf: 'SC', estado: 'Santa Catarina' },
            { uf: 'SP', estado: 'São Paulo' },
            { uf: 'SE', estado: 'Sergipe' },
            { uf: 'TO', estado: 'Tocantins ' },
        ] as T;
    }
}

export default GetHttpClientStates;
