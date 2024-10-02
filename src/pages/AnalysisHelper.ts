
// src/pages/AnalysisHelper.ts

import Constants from "./AnalysisConstants";
import { IAnalysisInfo } from "./IAnalysisInfo";
// src/pages/AnalysisHelper.ts

export const buildUrl = async (
    path: string,
    startDate: Date,
    endDate: Date,
    analysis: string,
    interval: string,
    state?: string,
    city?: string,
    country?: string,
    source?: string,
    label?: string
): Promise<string> => {
    const startDateFormatted = startDate ? startDate.toISOString().split('T')[0] : null;
    const endDateFormatted = endDate ? endDate.toISOString().split('T')[0] : null;
    const selectedStateIsoCode = state ? Constants.stateToIsoCodeMap[state] || state : null;
    const encodedSource = source ? encodeURIComponent(source) : null;
    const encodedLabel = label ? encodeURIComponent(label) : null;

    // Base URL usando o caminho fornecido
    let url = `http://localhost:3001/${path}/${interval}?analysis=${encodeURIComponent(analysis)}`;

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
