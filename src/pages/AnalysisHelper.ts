
// src/pages/AnalysisHelper.ts


export const getValidLabelsByAnalysis = (analysis: string): string[] => {
	switch (analysis.toLowerCase()) {
		case 'erosão':
			return ['pastagem', 'cultura'];
		case 'gee':
			return ['tecnologia2', 'tecnologia1', 'tecnologia3', 'tecnologia4'];
		case 'nh3':
			return [
				'fertilizantes químicos',
				'fertilizantes orgânicos',
				'manejo de esterco',
				'deposição de extretas',
				'queimas de resíduos de culturas',
			];
		case 'npk':
			return [
				'dejetos animais',
				'deposição atmosférica',
				'fertilizantes minerais',
				'fertilizantes orgânicos',
				'fixação biológica de nitrogênio',
				'resíduos culturais',
				'resíduos industriais',
				'resíduos urbanos',
				'produção carne bovina',
				'produção agrícola',
				'área agropecuária',
			];
		case 'orgânicas':
			return ['grão', 'hortaliças', 'fruticultura', 'pastagem'];
		case 'pesticidas':
			return ['herbicidas', 'fungicidas', 'inseticitas', 'outros'];
		case 'poluição':
			return ['nitrato', 'fosfato', 'cations', 'anions'];
		default:
			return [];
	}
};


export const analysisDescriptions = (startDate: Date, endDate: Date) => {
	return {
		erosao: {
			title: 'Análise de Erosão',
			description:
				'A análise de erosão foca em identificar e monitorar áreas sujeitas à degradação do solo devido à ação da água ou vento. Essa análise é fundamental para a preservação ambiental e a implementação de práticas de conservação.',
			source: 'Instituto Agronômico de Campinas (IAC)',
			labels: 'Pastagem, Cultura',
			period: `${startDate.getFullYear()} até ${endDate.getFullYear()}`, // Atualizando o período
			charts: 'Média Móvel Simples, Soma Agregada, Percentual',
		},
		gee: {
			title: 'Análise de Emissões de GEE (Gases de Efeito Estufa)',
			description:
				'Esta análise acompanha as emissões de gases de efeito estufa (GEE) provenientes de diversas atividades agrícolas e industriais, sendo essencial para entender o impacto das mudanças climáticas.',
			source: 'Organização para a Cooperação e Desenvolvimento Econômico (OCDE)',
			labels: 'Tecnologia 1, Tecnologia 2, Tecnologia 3, Tecnologia 4',
			period: `${startDate.getFullYear()} até ${endDate.getFullYear()}`,
			charts: 'Média Móvel Simples, Soma Agregada, Percentual',
		},
		nh3: {
			title: 'Análise de Emissões de NH3',
			description:
				'A análise de emissões de amônia (NH3) busca entender como a aplicação de fertilizantes e o manejo de dejetos animais contribuem para a poluição do ar e a acidificação do solo.',
			source: 'Universidade de Brasília (UNB)',
			labels: 'Fertilizantes Químicos, Fertilizantes Orgânicos, Manejo de Esterco, Deposição de Extretas',
			period: `${startDate.getFullYear()} até ${endDate.getFullYear()}`,
			charts: 'Média Móvel Simples, Soma Agregada, Percentual',
		},
		npk: {
			title: 'Análise de Nutrientes NPK',
			description:
				'Esta análise aborda o uso de nutrientes NPK (nitrogênio, fósforo e potássio) nas práticas agrícolas e seu impacto sobre a produtividade e a sustentabilidade do solo.',
			source: 'Instituto Agronômico de Campinas (IAC)',
			labels: 'Dejetos Animais, Deposição Atmosférica, Fertilizantes Minerais, Produção Agrícola',
			period: `${startDate.getFullYear()} até ${endDate.getFullYear()}`,
			charts: 'Média Móvel Simples, Soma Agregada, Percentual',
		},
		organicas: {
			title: 'Análise de Áreas Orgânicas',
			description:
				'A análise de áreas orgânicas foca no acompanhamento do uso de práticas agrícolas orgânicas, explorando o impacto positivo no meio ambiente e a qualidade do solo.',
			source: 'Universidade de Brasília (UNB)',
			labels: 'Grão, Hortaliças, Fruticultura, Pastagem',
			period: `${startDate.getFullYear()} até ${endDate.getFullYear()}`,
			charts: 'Média Móvel Simples, Soma Agregada, Percentual',
		},
		pesticidas: {
			title: 'Análise de Uso de Pesticidas',
			description:
				'Esta análise acompanha o uso de pesticidas, como herbicidas, fungicidas e inseticidas, nas práticas agrícolas, avaliando o impacto sobre o solo e os ecossistemas.',
			source: 'Organização para a Cooperação e Desenvolvimento Econômico (OCDE)',
			labels: 'Herbicidas, Fungicidas, Inseticidas, Outros',
			period: `${startDate.getFullYear()} até ${endDate.getFullYear()}`,
			charts: 'Média Móvel Simples, Soma Agregada, Percentual',
		},
		poluicao: {
			title: 'Análise de Poluição',
			description:
				'A análise de poluição monitora a presença de poluentes como nitrato, fosfato, cátions e ânions no solo e na água, essenciais para preservar a qualidade dos recursos naturais.',
			source: 'Universidade de Brasília (UNB)',
			labels: 'Nitrato, Fosfato, Cations, Anions',
			period: `${startDate.getFullYear()} até ${endDate.getFullYear()}`,
			charts: 'Média Móvel Simples, Soma Agregada, Percentual',
		},
	};
}
