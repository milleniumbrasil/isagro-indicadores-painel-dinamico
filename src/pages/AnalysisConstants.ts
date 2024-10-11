import { estados } from 'isagro-map';
import { IAnalysisInfo } from "./IAnalysisInfo";

export interface TileLayerConfig {
	layers?: string;
	styles?: string;
	format?: string;
	transparent?: boolean;
	version?: string;
	crs?: string;
	uppercase?: boolean;
	url?: string;
	exceptions?: string;
	bgcolor?: string;
	width: number;
	height: number;
	bbox: string;
	zoom?: number;
	customParams?: { [key: string]: string | boolean | number | undefined };
}

export type Label = { label: string; value: string };

export function analysisDescriptions(startDate: Date, endDate: Date): Record<string, IAnalysisInfo> {
	const period = `${startDate.getFullYear()} até ${endDate.getFullYear()}`;
	const commonCharts = 'Média Móvel Simples, Soma Agregada, Percentual';

	return {
		erosao: {
			title: 'Análise de Erosão',
			description:
				'A análise de erosão foca em identificar e monitorar áreas sujeitas à degradação do solo devido à ação da água ou vento. Essa análise é fundamental para a preservação ambiental e a implementação de práticas de conservação.',
			source: 'Instituto Agronômico de Campinas (IAC)',
			labels: 'Pastagem, Cultura',
			period,
			charts: commonCharts,
		},
		gee: {
			title: 'Análise de Emissões de GEE (Gases de Efeito Estufa)',
			description:
				'Esta análise acompanha as emissões de gases de efeito estufa (GEE) provenientes de diversas atividades agrícolas e industriais, sendo essencial para entender o impacto das mudanças climáticas.',
			source: 'Organização para a Cooperação e Desenvolvimento Econômico (OCDE)',
			labels: 'Tecnologia 1, Tecnologia 2, Tecnologia 3, Tecnologia 4',
			period,
			charts: commonCharts,
		},
		nh3: {
			title: 'Análise de Emissões de NH3',
			description:
				'A análise de emissões de amônia (NH3) busca entender como a aplicação de fertilizantes e o manejo de dejetos animais contribuem para a poluição do ar e a acidificação do solo.',
			source: 'Universidade de Brasília (UNB)',
			labels: 'Fertilizantes Químicos, Fertilizantes Orgânicos, Manejo de Esterco, Deposição de Extretas',
			period,
			charts: commonCharts,
		},
		npk: {
			title: 'Análise de Nutrientes NPK',
			description:
				'Esta análise aborda o uso de nutrientes NPK (nitrogênio, fósforo e potássio) nas práticas agrícolas e seu impacto sobre a produtividade e a sustentabilidade do solo.',
			source: 'Instituto Agronômico de Campinas (IAC)',
			labels: 'Dejetos Animais, Deposição Atmosférica, Fertilizantes Minerais, Produção Agrícola',
			period,
			charts: commonCharts,
		},
		organicas: {
			title: 'Análise de Áreas Orgânicas',
			description:
				'A análise de áreas orgânicas foca no acompanhamento do uso de práticas agrícolas orgânicas, explorando o impacto positivo no meio ambiente e a qualidade do solo.',
			source: 'Universidade de Brasília (UNB)',
			labels: 'Grão, Hortaliças, Fruticultura, Pastagem',
			period,
			charts: commonCharts,
		},
		pesticidas: {
			title: 'Análise de Uso de Pesticidas',
			description:
				'Esta análise acompanha o uso de pesticidas, como herbicidas, fungicidas e inseticidas, nas práticas agrícolas, avaliando o impacto sobre o solo e os ecossistemas.',
			source: 'Organização para a Cooperação e Desenvolvimento Econômico (OCDE)',
			labels: 'Herbicidas, Fungicidas, Inseticidas, Outros',
			period,
			charts: commonCharts,
		},
		poluicao: {
			title: 'Análise de Poluição',
			description:
				'A análise de poluição monitora a presença de poluentes como nitrato, fosfato, cátions e ânions no solo e na água, essenciais para preservar a qualidade dos recursos naturais.',
			source: 'Universidade de Brasília (UNB)',
			labels: 'Nitrato, Fosfato, Cations, Anions',
			period,
			charts: commonCharts,
		},
	};
}

export default class Contants {

	public static readonly defaultState = estados['Distrito Federal'].bbox.join(',');

	public static readonly initialConfig: TileLayerConfig = {
		layers: 'CCAR:BCIM_Unidade_Federacao_A',
		styles: '',
		format: 'image/png',
		transparent: true,
		version: '1.1.1',
		crs: 'EPSG:4326',
		uppercase: true,
		url: 'https://geoservicos.ibge.gov.br/geoserver/wms',
		exceptions: 'application/vnd.ogc.se_xml',
		bgcolor: '0xFEFFFF',
		width: 606,
		height: 558,
		bbox: this.defaultState,
		zoom: 6,
		customParams: {},
	};

	// Mapeamento do nome do estado para o código ISO
	public static readonly stateToIsoCodeMap: { [key: string]: string } = {
		Acre: 'AC',
		Alagoas: 'AL',
		Amapá: 'AP',
		Amazonas: 'AM',
		Bahia: 'BA',
		Ceará: 'CE',
		'Distrito Federal': 'DF',
		'Espírito Santo': 'ES',
		Goiás: 'GO',
		Maranhão: 'MA',
		'Mato Grosso': 'MT',
		'Mato Grosso do Sul': 'MS',
		'Minas Gerais': 'MG',
		Pará: 'PA',
		Paraíba: 'PB',
		Paraná: 'PR',
		Pernambuco: 'PE',
		Piauí: 'PI',
		'Rio de Janeiro': 'RJ',
		'Rio Grande do Norte': 'RN',
		'Rio Grande do Sul': 'RS',
		Rondônia: 'RO',
		Roraima: 'RR',
		'Santa Catarina': 'SC',
		'São Paulo': 'SP',
		Sergipe: 'SE',
		Tocantins: 'TO',
	};
}
