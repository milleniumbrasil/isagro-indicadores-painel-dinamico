import { iEstado, estados, Map } from 'isagro-map';

export type Label = { label: string; value: string };

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

export const defaultState = estados['Distrito Federal'].bbox.join(',');

export const initialConfig: TileLayerConfig = {
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
	bbox: defaultState,
	zoom: 6,
	customParams: {},
};

export const availableAnalysis = [
	{ label: 'Erosões', value: 'erosão' },
	{ label: 'GEE', value: 'GEE' },
	{ label: 'NH3', value: 'NH3' },
	{ label: 'NPK', value: 'NPK' },
	{ label: 'Orgânicas', value: 'orgânicas' },
	{ label: 'Pesticidas', value: 'pesticidas' },
	{ label: 'Poluições', value: 'poluição' },
];

export const availableLabels: Label[] = [
	{ label: 'Pastagem', value: 'pastagem' },
	{ label: 'Cultura', value: 'cultura' },
	{ label: 'Tecnologia 1', value: 'tecnologia1' },
	{ label: 'Tecnologia 2', value: 'tecnologia2' },
	{ label: 'Tecnologia 3', value: 'tecnologia3' },
	{ label: 'Tecnologia 4', value: 'tecnologia4' },
	{ label: 'Fertilizantes Químicos', value: 'fertilizantes químicos' },
	{ label: 'Fertilizantes Orgânicos', value: 'fertilizantes orgânicos' },
	{ label: 'Manejo de Esterco', value: 'manejo de esterco' },
	{ label: 'Deposição de Extretas', value: 'deposição de extretas' },
	{ label: 'Queimas de Resíduos de Culturas', value: 'queimas de resíduos de culturas' },
	{ label: 'Dejetos Animais', value: 'dejetos animais' },
	{ label: 'Deposição Atmosférica', value: 'deposição atmosférica' },
	{ label: 'Fertilizantes Minerais', value: 'fertilizantes minerais' },
	{ label: 'Fixação Biológica de Nitrogênio', value: 'fixação biológica de nitrogênio' },
	{ label: 'Resíduos Culturais', value: 'resíduos culturais' },
	{ label: 'Resíduos Industriais', value: 'resíduos industriais' },
	{ label: 'Resíduos Urbanos', value: 'resíduos urbanos' },
	{ label: 'Produção Carne Bovina', value: 'produção carne bovina' },
	{ label: 'Produção Agrícola', value: 'produção agrícola' },
	{ label: 'Área Agropecuária', value: 'área agropecuária' },
	{ label: 'Grão', value: 'grão' },
	{ label: 'Hortaliças', value: 'hortaliças' },
	{ label: 'Fruticultura', value: 'fruticultura' },
	{ label: 'Herbicidas', value: 'herbicidas' },
	{ label: 'Fungicidas', value: 'fungicidas' },
	{ label: 'Inseticidas', value: 'inseticitas' },
	{ label: 'Outros', value: 'outros' },
	{ label: 'Nitrato', value: 'nitrato' },
	{ label: 'Fosfato', value: 'fosfato' },
	{ label: 'Cations', value: 'cations' },
	{ label: 'Ânions', value: 'anions' },
];

export const availableSsources = [
	{ label: 'Organização para a Cooperação e Desenvolvimento Econômico', value: 'OCDE' },
	{ label: 'Instituto Agronômico de Campinas', value: 'IAC' },
	{ label: 'Universidade de Brasília', value: 'UNB' },
];

// Mapeamento do nome do estado para o código ISO
export const stateToIsoCodeMap: { [key: string]: string } = {
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
