// src/pages/AnalysisPage.tsx

import './AnalysisPage.css';
import 'rsuite/SelectPicker/styles/index.css';
import 'rsuite/DateRangePicker/styles/index.css';
import 'rsuite/dist/rsuite.min.css';

import { FC, useEffect, useState, Suspense, SyntheticEvent } from 'react';

import InfoIcon from '@mui/icons-material/Info';

import { Box, Fab, FormControl, MenuItem, Paper, Select, SelectChangeEvent, Typography } from '@mui/material';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import FolderIcon from '@mui/icons-material/Folder';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import { iEstado, estados, Map } from 'isagro-map';

import {
    greenBackgroundColor,
    yellowPalette,
    bluePalette,
    brownPalette,
    brownBackgroundColor,
    redBackgroundColor,
    grayBackgroundColor,
    blueBackgroundColor,
    blueColors,
    purplePalette,
    yellowBackgroundColor,
    greenPalette,
    redPalette,
} from '../components/colors';
import AreaChart from '../components/charts/AreaChart';

import { DateRangePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';

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

import { Loader } from 'rsuite';
import { DateRange } from 'rsuite/esm/DateRangePicker';
import { IStackedAreaChart } from '../components/charts/IStackedAreaChart';
import { IPercentualAreaChart } from '../components/charts/IPercentualAreaChart';
import PercentualAreaChart from '../components/charts/PercentualAreaChart';
import { AnalysisContext } from '../components/AnalysisContext';
import { AnalysisProvider } from '../components/AnalysisProvider';

export function Loading() {
    return (
        <div>
            <Loader backdrop content="loading..." vertical />
        </div>
    );
}

const AnalysisPage: FC = () => {

    const defaultState = estados['Distrito Federal'].bbox.join(',');
    const initialConfig: TileLayerConfig = {
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

    type Label = { label: string; value: string };

    const [selectedSource, setSelectedSource] = useState<string>('');
    const [selectedAnalysis, setSelectedAnalysis] = useState<string>('orgânicas');
    const [labels, setLabels] = useState<Label[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<string>('');
    const [selectedStateName, setSelectedStateName] = useState<string>('Distrito Federal');
    const [selectedState, setSelectedState] = useState<iEstado>(estados['Distrito Federal']);
    const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date('1990-01-01'));
    const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date('1995-12-31'));
    const [interval, setInterval] = useState<string>('annual');
    const [analysisDescription, setAnalysisDescription] = useState<string>(`
        Análise: Orgânicas.
        Fonte: UNB.
        Rótulo: Fruticultura.
        Período: Janeiro de 1990 - Dezembro de 1995.
        Gráficos disponíveis: Média Móvel Simples, Soma Agregada, Percentual.
    `);

    const [internalStackedData, setInternalStackedData] = useState<IStackedAreaChart[]>([]);
    const [internalPercentualData, setInternalPercentualData] = useState<IPercentualAreaChart[]>([]);
    const [smaData, setSmaData] = useState<IStackedAreaChart[]>([]);
    const [layers, setLayers] = useState(initialConfig.layers);
    const [styles, setStyles] = useState(initialConfig.styles);
    const [format, setFormat] = useState(initialConfig.format);
    const [transparent, setTransparent] = useState(initialConfig.transparent);
    const [version, setVersion] = useState(initialConfig.version);
    const [crs, setCrs] = useState(initialConfig.crs);
    const [uppercase, setUppercase] = useState(initialConfig.uppercase);
    const [url, setUrl] = useState(initialConfig.url);
    const [exceptions, setExceptions] = useState(initialConfig.exceptions);
    const [bgcolor, setBgcolor] = useState(initialConfig.bgcolor);
    const [width, setWidth] = useState(initialConfig.width);
    const [height, setHeight] = useState(initialConfig.height);
    const [bbox, setBbox] = useState(initialConfig.bbox);
    const [zoom, setZoom] = useState(initialConfig.zoom);
    const [open, setOpen] = useState(false);
    const [currentZoom, setCurrentZoom] = useState(selectedState.zoom);
    const [currentBbox, setCurrentBbox] = useState<string>();
    const [currentCenter, setCurrentCenter] = useState<string>();
    const [loading, setLoading] = useState(true);

    const availableAnalysis = [
        { label: 'Erosões', value: 'erosão' },
        { label: 'GEE', value: 'GEE' },
        { label: 'NH3', value: 'NH3' },
        { label: 'NPK', value: 'NPK' },
        { label: 'Orgânicas', value: 'orgânicas' },
        { label: 'Pesticidas', value: 'pesticidas' },
        { label: 'Poluições', value: 'poluição' },
    ];

    const availableLabels: Label[] = [
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

    const availableSsources = [
        { label: 'Organização para a Cooperação e Desenvolvimento Econômico', value: 'OCDE' },
        { label: 'Instituto Agronômico de Campinas', value: 'IAC' },
        { label: 'Universidade de Brasília', value: 'UNB' },
    ];

    // Mapeamento do nome do estado para o código ISO
    const stateToIsoCodeMap: { [key: string]: string } = {
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

    const getValidLabelsByAnalysis = (analysis: string): string[] => {
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

    const reset = () => {
        console.log('Resetting to initial config:', initialConfig);
        setSelectedState(estados['Distrito Federal']);
        setLayers(initialConfig.layers);
        setStyles(initialConfig.styles);
        setFormat(initialConfig.format);
        setTransparent(initialConfig.transparent);
        setVersion(initialConfig.version);
        setCrs(initialConfig.crs);
        setUppercase(initialConfig.uppercase);
        setUrl(initialConfig.url);
        setExceptions(initialConfig.exceptions);
        setBgcolor(initialConfig.bgcolor);
        setWidth(initialConfig.width);
        setHeight(initialConfig.height);
        setBbox(initialConfig.bbox);
        setZoom(initialConfig.zoom);
    };

    const handleStateChange = (event: SelectChangeEvent) => {
        const stateName = event.target.value as string;
        setSelectedStateName(stateName);
        const state = estados[stateName];
        setSelectedState(state);
        setBbox(state.bbox.join(','));
        setZoom(state.zoom);
    };

    const handleIntervalChange = (event: SelectChangeEvent) => {
        setInterval(event.target.value); // Atualiza o intervalo selecionado
    };

    const handleChangeRangeDates = (rangeDates: DateRange | null, event: SyntheticEvent<Element, Event>) => {
        if (rangeDates) {
            setSelectedStartDate(rangeDates[0]);
            setSelectedEndDate(rangeDates[1]);
        }
    };

    const handleSourceChange = (event: SelectChangeEvent) => {
        const selectedValue = event.target.value as string;
        setSelectedSource(selectedValue);
    };

    const handleAnalysisChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value as string;
        setSelectedAnalysis(selectedValue);

        // Busca os rótulos válidos com base na análise e mapeia-os para a exibição correta
        const validLabelValues = getValidLabelsByAnalysis(selectedValue);
        const validLabelsForDisplay = availableLabels.filter((labelItem) => validLabelValues.includes(labelItem.value));
        setLabels(validLabelsForDisplay);
        console.log('Análise selecionada:', selectedValue);
    };

    const handleLabelChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value as string;
        setSelectedLabel(selectedValue); // Atualiza o estado do rótulo selecionado
        console.log('Rótulo selecionado:', selectedValue);
    };

    const analysisDescriptions = {
        erosao: {
            title: 'Análise de Erosão',
            description:
                'A análise de erosão foca em identificar e monitorar áreas sujeitas à degradação do solo devido à ação da água ou vento. Essa análise é fundamental para a preservação ambiental e a implementação de práticas de conservação.',
            source: 'Instituto Agronômico de Campinas (IAC)',
            labels: 'Pastagem, Cultura',
            period: `${selectedStartDate.getFullYear()} até ${selectedEndDate.getFullYear()}`, // Atualizando o período
            charts: 'Média Móvel Simples, Soma Agregada, Percentual',
        },
        gee: {
            title: 'Análise de Emissões de GEE (Gases de Efeito Estufa)',
            description:
                'Esta análise acompanha as emissões de gases de efeito estufa (GEE) provenientes de diversas atividades agrícolas e industriais, sendo essencial para entender o impacto das mudanças climáticas.',
            source: 'Organização para a Cooperação e Desenvolvimento Econômico (OCDE)',
            labels: 'Tecnologia 1, Tecnologia 2, Tecnologia 3, Tecnologia 4',
            period: `${selectedStartDate.getFullYear()} até ${selectedEndDate.getFullYear()}`,
            charts: 'Média Móvel Simples, Soma Agregada, Percentual',
        },
        nh3: {
            title: 'Análise de Emissões de NH3',
            description:
                'A análise de emissões de amônia (NH3) busca entender como a aplicação de fertilizantes e o manejo de dejetos animais contribuem para a poluição do ar e a acidificação do solo.',
            source: 'Universidade de Brasília (UNB)',
            labels: 'Fertilizantes Químicos, Fertilizantes Orgânicos, Manejo de Esterco, Deposição de Extretas',
            period: `${selectedStartDate.getFullYear()} até ${selectedEndDate.getFullYear()}`,
            charts: 'Média Móvel Simples, Soma Agregada, Percentual',
        },
        npk: {
            title: 'Análise de Nutrientes NPK',
            description:
                'Esta análise aborda o uso de nutrientes NPK (nitrogênio, fósforo e potássio) nas práticas agrícolas e seu impacto sobre a produtividade e a sustentabilidade do solo.',
            source: 'Instituto Agronômico de Campinas (IAC)',
            labels: 'Dejetos Animais, Deposição Atmosférica, Fertilizantes Minerais, Produção Agrícola',
            period: `${selectedStartDate.getFullYear()} até ${selectedEndDate.getFullYear()}`,
            charts: 'Média Móvel Simples, Soma Agregada, Percentual',
        },
        organicas: {
            title: 'Análise de Áreas Orgânicas',
            description:
                'A análise de áreas orgânicas foca no acompanhamento do uso de práticas agrícolas orgânicas, explorando o impacto positivo no meio ambiente e a qualidade do solo.',
            source: 'Universidade de Brasília (UNB)',
            labels: 'Grão, Hortaliças, Fruticultura, Pastagem',
            period: `${selectedStartDate.getFullYear()} até ${selectedEndDate.getFullYear()}`,
            charts: 'Média Móvel Simples, Soma Agregada, Percentual',
        },
        pesticidas: {
            title: 'Análise de Uso de Pesticidas',
            description:
                'Esta análise acompanha o uso de pesticidas, como herbicidas, fungicidas e inseticidas, nas práticas agrícolas, avaliando o impacto sobre o solo e os ecossistemas.',
            source: 'Organização para a Cooperação e Desenvolvimento Econômico (OCDE)',
            labels: 'Herbicidas, Fungicidas, Inseticidas, Outros',
            period: `${selectedStartDate.getFullYear()} até ${selectedEndDate.getFullYear()}`,
            charts: 'Média Móvel Simples, Soma Agregada, Percentual',
        },
        poluicao: {
            title: 'Análise de Poluição',
            description:
                'A análise de poluição monitora a presença de poluentes como nitrato, fosfato, cátions e ânions no solo e na água, essenciais para preservar a qualidade dos recursos naturais.',
            source: 'Universidade de Brasília (UNB)',
            labels: 'Nitrato, Fosfato, Cations, Anions',
            period: `${selectedStartDate.getFullYear()} até ${selectedEndDate.getFullYear()}`,
            charts: 'Média Móvel Simples, Soma Agregada, Percentual',
        },
    };

    const findAnalysisDescription = (selectedAnalysis: string) => {
        const analysisLowerCase = selectedAnalysis.toLowerCase();

        // Usa Object.values para varrer apenas os valores do objeto
        for (const value of Object.values(analysisDescriptions)) {
            if (value.title.toLowerCase().includes(analysisLowerCase)) {
                return value; // Retorna a descrição correspondente
            }
        }

        return null;
    };

    const currentAnalysisDescription = findAnalysisDescription(selectedAnalysis);

    const buildUrl = () => {
        const startDateFormatted = selectedStartDate ? selectedStartDate.toISOString().split('T')[0] : null;
        const endDateFormatted = selectedEndDate ? selectedEndDate.toISOString().split('T')[0] : null;
        const selectedStateIsoCode = selectedStateName ? stateToIsoCodeMap[selectedStateName] || selectedStateName : null;
        const encodedSource = selectedSource ? encodeURIComponent(selectedSource) : null;
        const encodedLabel = selectedLabel ? encodeURIComponent(selectedLabel) : null;

        // Parâmetros obrigatórios
        let url = `http://localhost:3001/sum/${interval}?analysis=${encodeURIComponent(selectedAnalysis)}`;

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

    const fetchData = async () => {
        setLoading(true);
        const url = buildUrl();

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Falha ao buscar os dados');

            const data: IStackedAreaChart[] = await response.json();

            setInternalStackedData(data);
        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSmaData = async () => {
        setLoading(true);
        const startDateFormatted = selectedStartDate.toISOString().split('T')[0];
        const endDateFormatted = selectedEndDate.toISOString().split('T')[0];

        const url = `http://localhost:3001/sma/${interval}?analysis=${encodeURIComponent(
            selectedAnalysis,
        )}&startDate=${startDateFormatted}&endDate=${endDateFormatted}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Falha ao buscar os dados de Média Móvel');
            }
            const data: IStackedAreaChart[] = await response.json();
            setSmaData(data);
        } catch (error) {
            console.error('Erro ao buscar os dados de Média Móvel:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPercentagelData = async () => {
        setLoading(true);
        const startDateFormatted = selectedStartDate.toISOString().split('T')[0];
        const endDateFormatted = selectedEndDate.toISOString().split('T')[0];

        const url = `http://localhost:3001/percentage/${interval}?analysis=${encodeURIComponent(
            selectedAnalysis,
        )}&startDate=${startDateFormatted}&endDate=${endDateFormatted}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Falha ao buscar os dados de percentage');
            }
            const stackedData: IStackedAreaChart[] = await response.json();
            // Transformando de IStackedAreaChart para IPercentualAreaChart
            const percentualData: IPercentualAreaChart[] = stackedData.map((item) => ({
                period: item.period,
                value: parseFloat(item.entry[1].toString()), // Pega diretamente o valor de entry[1] como percentual
            }));

            setInternalPercentualData(percentualData);
        } catch (error) {
            console.error('Erro ao buscar os dados de percentage:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchSmaData();
        fetchPercentagelData();
    }, [selectedAnalysis, selectedLabel, selectedStartDate, selectedEndDate, selectedStateName, selectedSource, interval]);

    return (

    <AnalysisProvider>

            <div>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<InfoIcon />}
                        aria-controls="summary-content"
                        id="summary-header"
                        sx={{ justifyContent: 'flex-end' }}
                    >
                        <Typography sx={{ ml: 'auto', marginRight: '10px' }}>Sobre o painel de análise de {selectedAnalysis}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
                            <Typography variant="h6" sx={{ padding: '15px' }}>
                                {currentAnalysisDescription?.title || 'Informações Detalhadas da Análise'}
                            </Typography>

                            <Typography variant="body1" sx={{ padding: '10px' }}>
                                {currentAnalysisDescription?.description || 'Descrição não disponível para esta análise.'}
                            </Typography>

                            <List dense>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <InfoIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Fonte" secondary={currentAnalysisDescription?.source || selectedSource} />
                                </ListItem>
                                <Divider variant="inset" component="li" />

                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <FolderIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Rótulo" secondary={currentAnalysisDescription?.labels || selectedLabel} />
                                </ListItem>
                                <Divider variant="inset" component="li" />

                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <FolderIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Período"
                                        secondary={`De ${selectedStartDate.getFullYear()} até ${selectedEndDate.getFullYear()}`}
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />

                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <FolderIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Gráficos disponíveis"
                                        secondary={currentAnalysisDescription?.charts || 'Média Móvel Simples, Soma Agregada, Percentual'}
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    </AccordionDetails>
                </Accordion>

                <Box sx={{ display: 'flex', '& > :not(style)': { m: 1 } }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Map
                            estado={selectedState}
                            width={width}
                            height={height}
                            coordinateOnClick={(coordinate: Array<number>) => alert(`Coordenada do clique: ${coordinate}`)}
                            onZoomChange={(zoom: number) => setCurrentZoom(zoom)}
                            onBboxChange={(b: Array<number>) => setCurrentBbox(b.join(', '))}
                            onCenterChange={(c: Array<number>) => setCurrentCenter(c.join(', '))}
                            version="1.3.0"
                            request="GetMap"
                            srs="EPSG:4326"
                            layers="CCAR:BCIM_Unidade_Federacao_A"
                            format="image/jpeg"
                            transparent={false}
                            bgcolor="0xFFFFFF"
                        />
                    </Box>

                    <Box sx={{ width: '50%', alignItems: 'center', padding: '5px', margin: '5px' }}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="period-content" id="period-header">
                                <Typography>
                                    Período selecionado de {selectedStartDate.getFullYear()} até {selectedEndDate.getFullYear()}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>Ao selecionar um período, os gráficos devem exibir os dados correspondentes.</Typography>
                                <Divider variant="middle" sx={{ margin: '15px' }} />
                                <FormControl fullWidth>
                                    <DateRangePicker
                                        format="MMM yyyy"
                                        caretAs={BsCalendar2MonthFill}
                                        limitEndYear={1900}
                                        limitStartYear={new Date().getFullYear()}
                                        onChange={handleChangeRangeDates}
                                    />
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="estado-content" id="estado-header">
                                <Typography>Estado selecionado {selectedStateName}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>Ao selecionar um estado, o mapa deve exibir a imagem correspondente.</Typography>
                                <Divider variant="middle" sx={{ margin: '15px' }} />
                                <FormControl fullWidth>
                                    <Select id="state-select" value={selectedStateName} onChange={handleStateChange}>
                                        <MenuItem value="">
                                            <em>Não informado</em>
                                        </MenuItem>
                                        {Object.keys(estados).map((e, index) => (
                                            <MenuItem id={`${index}-menu-item-estado`} value={e} key={e}>
                                                {e}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="analysis-content" id="analysis-header">
                                <Typography>Análise selecionada {selectedAnalysis}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>Ao selecionar uma análise, os gráficos devem exibir os dados correspondentes.</Typography>
                                <Divider variant="middle" sx={{ margin: '15px' }} />
                                <FormControl fullWidth>
                                    <Select id="analysis-select" value={selectedAnalysis} onChange={handleAnalysisChange}>
                                        {availableAnalysis.map((e, index) => (
                                            <MenuItem id={`${index}-menu-item-analysis`} value={e.value} key={index}>
                                                {e.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="label-content" id="label-header">
                                <Typography>Rótulo selecionado {selectedLabel}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>Ao selecionar um rótulo, os gráficos devem exibir os dados correspondentes.</Typography>
                                <Divider variant="middle" sx={{ margin: '15px' }} />
                                <FormControl fullWidth>
                                    <Select id="analysis-select" value={selectedLabel} onChange={handleLabelChange}>
                                        <MenuItem value="">
                                            <em>Não informado</em>
                                        </MenuItem>
                                        {labels.map((labelItem, index) => (
                                            <MenuItem id={`${index}-menu-item-label`} value={labelItem.value} key={index}>
                                                {labelItem.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="source-content" id="source-header">
                                <Typography>Fonte selecionada {selectedSource}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>Ao selecionar uma fonte, os gráficos devem exibir os dados correspondentes.</Typography>
                                <Divider variant="middle" sx={{ margin: '15px' }} />
                                <FormControl fullWidth>
                                    <Select id="source-select" value={selectedSource} onChange={handleSourceChange}>
                                        <MenuItem value="">
                                            <em>Não informado</em>
                                        </MenuItem>
                                        {availableSsources.map((e, index) => (
                                            <MenuItem id={`${index}-menu-item-source`} value={e.value} key={index}>
                                                {e.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="interval-content" id="interval-header">
                                <Typography>Intervalo selecionado {interval}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>Selecione o intervalo para a análise (anual, bienal, etc.).</Typography>
                                <Divider variant="middle" sx={{ margin: '15px' }} />
                                <FormControl fullWidth>
                                    <Select id="interval-select" value={interval} onChange={handleIntervalChange}>
                                        <MenuItem value="annual">Anual</MenuItem>
                                        <MenuItem value="biennial">Bienal</MenuItem>
                                        <MenuItem value="triennial">Trienal</MenuItem>
                                        <MenuItem value="quadrennial">Quadrienal</MenuItem>
                                        <MenuItem value="quinquennial">Quinquenal</MenuItem>
                                    </Select>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                        <Typography variant="h6" sx={{ padding: '15px' }}></Typography>
                        <Typography variant="body2" sx={{ padding: '35px', width: '550px' }}></Typography>

                        <Typography variant="body2"></Typography>
                    </Box>
                </Box>
                <Paper sx={{ width: '100%', alignItems: 'center', padding: '5px', margin: '5px', marginRight: '30px' }}>

                        <Typography variant="h6" sx={{ padding: '15px', marginTop: '15px' }}>
                            Como interpretar o gráfico de soma agregada
                        </Typography>
                        <Typography variant="body2" sx={{ padding: '10px' }}>
                            Este gráfico de soma agregada apresenta o total acumulado de dados ao longo do período selecionado. Ele exibe o
                            volume ou a soma dos valores de cada rótulo em diferentes períodos, permitindo a visualização de tendências e
                            comparações entre as categorias ao longo do tempo.
                        </Typography>
                        <Typography variant="body2" sx={{ padding: '10px' }}>
                            Para analisá-lo corretamente, observe a altura de cada camada no gráfico, que representa a contribuição de um
                            rótulo específico em relação ao total acumulado. A soma de todas as camadas em um determinado período reflete o
                            valor total acumulado até aquele momento.
                        </Typography>

                        <Card
                            variant="outlined"
                            sx={{ alignItems: 'center', width: '98%', backgroundColor: greenBackgroundColor, margin: '10px' }}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ padding: '15px' }}>
                                    {currentAnalysisDescription?.title} por período{' '}
                                    {`${selectedStartDate.getFullYear()} à ${selectedEndDate.getFullYear()}`}
                                </Typography>
                                <Typography variant="body2" sx={{ padding: '10px' }}>
                                    {currentAnalysisDescription?.description}
                                </Typography>

                                <AreaChart width={400} height={250} data={internalStackedData} defaultPalette={bluePalette} />
                            </CardContent>
                        </Card>

                        <Typography variant="h6" sx={{ padding: '15px', marginTop: '15px' }}>
                            Como interpretar o gráfico de Média Móvel Simples
                        </Typography>
                        <Typography variant="body2" sx={{ padding: '10px' }}>
                            Este gráfico de Média Móvel Simples utiliza uma técnica estatística para suavizar as variações dos dados ao
                            longo do tempo, calculando a média dos valores de um conjunto de períodos consecutivos. A principal vantagem
                            desta abordagem é eliminar flutuações de curto prazo, revelando tendências mais estáveis e padrões que poderiam
                            ser obscurecidos pelas variações naturais dos dados.
                        </Typography>
                        <Typography variant="body2" sx={{ padding: '10px' }}>
                            Para analisá-lo corretamente, observe que cada ponto do gráfico representa a média dos valores de um número fixo
                            de períodos anteriores. Dessa forma, ele suaviza os picos e vales dos dados brutos, proporcionando uma visão
                            mais clara da direção geral e das tendências de longo prazo. Esse tipo de análise é ideal para identificar se
                            uma variável está aumentando ou diminuindo ao longo do tempo de forma mais consistente, ao invés de seguir um
                            comportamento errático.
                        </Typography>

                        <Card
                            variant="outlined"
                            sx={{ alignItems: 'center', width: '98%', backgroundColor: yellowBackgroundColor, margin: '10px' }}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ padding: '15px' }}>
                                    {currentAnalysisDescription?.title} por período{' '}
                                    {`${selectedStartDate.getFullYear()} à ${selectedEndDate.getFullYear()}`}
                                </Typography>
                                <Typography variant="body2" sx={{ padding: '10px' }}>
                                    {currentAnalysisDescription?.description}
                                </Typography>

                                <AreaChart width={400} height={250} data={smaData} defaultPalette={purplePalette} />
                            </CardContent>
                        </Card>

                        <Typography variant="h6" sx={{ padding: '15px', marginTop: '15px' }}>
                            Como interpretar o gráfico de percentual
                        </Typography>
                        <Typography variant="body2" sx={{ padding: '10px' }}>
                            Este gráfico de percentual utiliza uma técnica de visualização que exibe os dados como uma proporção em relação
                            ao valor total, facilitando a análise das variações relativas ao longo do tempo. Ele é útil para identificar
                            mudanças na composição percentual de um dado conjunto, permitindo verificar, por exemplo, como diferentes
                            categorias (como áreas cultivadas) contribuem para o todo.
                        </Typography>
                        <Typography variant="body2" sx={{ padding: '10px' }}>
                            Para analisá-lo corretamente, observe as mudanças no valor percentual entre os períodos selecionados. A
                            tendência de aumento ou diminuição indica a variação da importância relativa de cada categoria ao longo do
                            tempo. Este tipo de gráfico é particularmente útil para comparações de categorias em diferentes períodos,
                            ajudando a entender a dinâmica de crescimento ou redução em termos proporcionais.
                        </Typography>

                        <Card
                            variant="outlined"
                            sx={{ alignItems: 'center', width: '98%', backgroundColor: blueBackgroundColor, margin: '10px' }}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ padding: '15px' }}>
                                    {currentAnalysisDescription?.title || selectedAnalysis} por período{' '}
                                    {`${selectedStartDate.getFullYear()} à ${selectedEndDate.getFullYear()}`}
                                </Typography>
                                <Typography variant="body2" sx={{ padding: '10px' }}>
                                    {currentAnalysisDescription?.description}
                                </Typography>
                                <PercentualAreaChart
                                    width={400}
                                    height={250}
                                    data={internalPercentualData}
                                    valueLabel="Área"
                                    fillColor={blueColors.lightSkyBlue}
                                    strokeColor={blueColors.lightBlue}
                                />
                            </CardContent>
                        </Card>
                </Paper>
            </div>

    </AnalysisProvider>
    );
};

export default AnalysisPage;
