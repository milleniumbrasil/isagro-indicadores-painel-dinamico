
// src/pages/AnalysisHelper.ts

import Constants, { analysisDescriptions } from "./AnalysisConstants";
import { IAnalysisInfo } from "./IAnalysisInfo";

export const buildUrl = (startDate: Date, endDate: Date, analysis: string, interval: string, stateName: string, source: string, label: string) => {
	const startDateFormatted = startDate ? startDate.toISOString().split('T')[0] : null;
	const endDateFormatted = endDate ? endDate.toISOString().split('T')[0] : null;
	const selectedStateIsoCode = stateName ? Constants.stateToIsoCodeMap[stateName] || stateName : null;
	const encodedSource = source ? encodeURIComponent(source) : null;
	const encodedLabel = label ? encodeURIComponent(label) : null;

	// Parâmetros obrigatórios
	let url = `http://localhost:3001/sum/${interval}?analysis=${encodeURIComponent(analysis)}`;

	// Parâmetros opcionais (adiciona à URL apenas se estiverem presentes)
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

	// Parâmetro fixo para cidade
	url += `&country=BR&city=Brasília`;

	return url;
};

export const findAnalysisDescription = (analysis: string, startDate: Date, endDate: Date): IAnalysisInfo => {
	const analysisLowerCase = analysis.toLowerCase();
	// Usa Object.values para varrer apenas os valores do objeto
	for (const value of Object.values(analysisDescriptions(startDate, endDate))) {
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
