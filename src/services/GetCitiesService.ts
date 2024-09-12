// src/services/GetCitiesService.ts

interface ICitiesService<T> {
	getData(): Promise<T | { error: string }>
}

interface RequestHeaders {
	[key: string]: string
}

class GetCitiesService<T> implements ICitiesService<T> {
	private baseURL: string
	private headers: RequestHeaders

	constructor(
		baseURL: string = process.env.REACT_APP_API_BASE_URL || "",
		headers: RequestHeaders = { accept: "*/*" },
	) {
		this.baseURL = baseURL
		this.headers = headers
	}

	public async getData(): Promise<T | { error: string }> {
		return [
			{ uf: "RJ", cidade: "Rio de Janeiro" },
			{ uf: "RJ", cidade: "Niterói" },
			{ uf: "RJ", cidade: "Angra dos Reis" },
			{ uf: "SP", cidade: "São Paulo" },
			{ uf: "SP", cidade: "Campinas" },
			{ uf: "SP", cidade: "Santos" },
			{ uf: "MG", cidade: "Belo Horizonte" },
			{ uf: "MG", cidade: "Uberlândia" },
			{ uf: "MG", cidade: "Juiz de Fora" },
			{ uf: "BA", cidade: "Salvador" },
			{ uf: "BA", cidade: "Feira de Santana" },
			{ uf: "BA", cidade: "Ilhéus" },
			{ uf: "RS", cidade: "Porto Alegre" },
			{ uf: "RS", cidade: "Caxias do Sul" },
			{ uf: "RS", cidade: "Pelotas" },
			{ uf: "AM", cidade: "Manaus" },
			{ uf: "AM", cidade: "Parintins" },
			{ uf: "AM", cidade: "Itacoatiara" },
			{ uf: "PE", cidade: "Recife" },
			{ uf: "PE", cidade: "Olinda" },
			{ uf: "PE", cidade: "Caruaru" },
		] as T
	}
}

export default GetCitiesService
