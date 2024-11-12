
// src/pages/AnalysisHelper.ts

import Constants from "./AnalysisConstants";
import { IAnalysisInfo } from "./IAnalysisInfo";

export const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export const buildLabelsUrl = async (
    analysis?: string
): Promise<string> => {

    const encodedAnalysis = analysis ? encodeURIComponent(analysis) : null;

    // Base URL usando o caminho fornecido
    let url = `${apiBaseUrl}/menu/labels`;

    // Array para armazenar os parâmetros de consulta
    const queryParams = [];

    // Adiciona parâmetros opcionais à lista de parâmetros de consulta
    if (encodedAnalysis) {
        queryParams.push(`analysis=${encodedAnalysis}`);
    }

    // Anexa os parâmetros de consulta à URL, se existirem
    if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
    }

    return url;
};

export const buildParamsUrl = async (
    analysis?: boolean,
    country?: boolean,
    state?: boolean,
    city?: boolean,
    source?: boolean,
    label?: boolean
): Promise<string> => {
    const encodedAnalysis = analysis ? encodeURIComponent(analysis) : null;
    const encodedLabel = label ? encodeURIComponent(label) : null;

    // Base URL usando o caminho fornecido
    let url = `${apiBaseUrl}/menu`;

    if (analysis) {
        url += `/analysis`;
    }
    if (state) {
        url += `/states`;
    }
    if (city) {
        url += `/cities`;
    }
    if (country) {
        url += `/countries`;
    }
    if (source) {
        url += `/sources`;
    }

    // Array para armazenar os parâmetros de consulta
    const queryParams = [];

    // Adiciona parâmetros opcionais à lista de parâmetros de consulta
    if (encodedAnalysis && encodedLabel) {
        queryParams.push(`analysis=${encodedAnalysis}`);
    }

    // Anexa os parâmetros de consulta à URL, se existirem
    if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
    }

    return url;
};

export const buildAnalysisUrl = async (): Promise<string> => {

    // Base URL usando o caminho fornecido
    let url = `${apiBaseUrl}/menu/analysis`;

    return url;
};

export const buildSourceUrl = async (): Promise<string> => {

    // Base URL usando o caminho fornecido
    let url = `${apiBaseUrl}/menu/sources`;

    return url;
};

export const buildStateUrl = async (): Promise<string> => {

    // Base URL usando o caminho fornecido
    let url = `${apiBaseUrl}/menu/states`;

    return url;
};

export const buildCityUrl = async (): Promise<string> => {

    // Base URL usando o caminho fornecido
    let url = `${apiBaseUrl}/menu/cities`;

    return url;
};

export const buildCountryUrl = async (): Promise<string> => {

    // Base URL usando o caminho fornecido
    let url = `${apiBaseUrl}/menu/countries`;

    return url;
};

export const buildUrl = async (
    path: string,
    startDate: Date,
    endDate: Date,
    analysis: string,
    interval: string,
    label?: string,
    state?: string,
    city?: string,
    country?: string,
    source?: string,
): Promise<string> => {
    const startDateFormatted = startDate ? startDate.toISOString().split('T')[0] : null;
    const endDateFormatted = endDate ? endDate.toISOString().split('T')[0] : null;
    const selectedStateIsoCode = state ? Constants.stateToIsoCodeMap[state] || state : null;
    const encodedSource = source ? encodeURIComponent(source) : null;
    const encodedLabel = label ? encodeURIComponent(label) : null;

    // Base URL usando o caminho fornecido
    let url = `${apiBaseUrl}/${path}/${interval}?analysis=${encodeURIComponent(analysis)}`;

    // Adiciona parâmetros opcionais se existirem
    if (encodedLabel) {
        url += `&label=${encodedLabel}`;
    }
    if (startDateFormatted) {
        url += `&startDate=${startDateFormatted}`;
    }
    if (endDateFormatted) {
        url += `&endDate=${endDateFormatted}`;
    }
    if (selectedStateIsoCode) {
        url += `&state=${selectedStateIsoCode}`;
    }
    if (encodedSource) {
        url += `&source=${encodedSource}`;
    }
    if (country) {
        url += `&source=${country}`;
    }
    if (city) {
        url += `&source=${city}`;
    }

    return url;
};

export const findAnalysisDescription = (analysis: string, startDate: Date, endDate: Date, analysisInfos: Record<string, IAnalysisInfo>): IAnalysisInfo => {
	const analysisLowerCase = analysis.toLowerCase();
	// Usa Object.values para varrer apenas os valores do objeto
	for (const value of Object.values(analysisInfos)) {
		if (value.title.toLowerCase().includes(analysisLowerCase)) {
			return value; // Retorna a descrição correspondente
		}
	}
	// Retorna um objeto padrão para "Orgânicas" se nenhuma descrição for encontrada
	return {
		title: 'Análise Orgânicas',
		period: '',
		description: 'Descrição padrão para análises orgânicas.',
		source: 'Fonte padrão',
		labels: 'Rótulo padrão',
		charts: 'Gráficos padrão'
	};
};
