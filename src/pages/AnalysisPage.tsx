// src/pages/AnalysisPage.tsx

import './AnalysisPage.css';
import 'rsuite/SelectPicker/styles/index.css';
import 'rsuite/DateRangePicker/styles/index.css';
import 'rsuite/dist/rsuite.min.css';

import { FC, useEffect, useState, SyntheticEvent } from 'react';

import InfoIcon from '@mui/icons-material/Info';

import { Box, FormControl, MenuItem, Paper, Select, SelectChangeEvent, Typography } from '@mui/material';

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

import { Loader } from 'rsuite';
import { DateRange } from 'rsuite/esm/DateRangePicker';
import { IStackedAreaChart } from '../components/charts/IStackedAreaChart';
import { IPercentualAreaChart } from '../components/charts/IPercentualAreaChart';
import PercentualAreaChart from '../components/charts/PercentualAreaChart';
import { AnalysisProvider } from '../components/AnalysisProvider';
import { availableAnalysis, availableLabels, availableSsources, initialConfig, Label, stateToIsoCodeMap } from './AnalysisConstants';
import { analysisDescriptions, getValidLabelsByAnalysis } from './AnalysisHelper';
import { useAnalysisContext } from '../components/AnalysisContext';

export function Loading() {
    return (
        <div>
            <Loader backdrop content="loading..." vertical />
        </div>
    );
}

const AnalysisPage: FC = () => {
    const { fetchSmaData } = useAnalysisContext();

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

    const findAnalysisDescription = (selectedAnalysis: string) => {
        const analysisLowerCase = selectedAnalysis.toLowerCase();

        // Usa Object.values para varrer apenas os valores do objeto
        for (const value of Object.values(analysisDescriptions(selectedStartDate, selectedEndDate))) {
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

    const fetchPercentageData = async () => {
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
        fetchSmaData(selectedStartDate, selectedEndDate, selectedAnalysis, interval).then((data: IStackedAreaChart[]) => setSmaData(data));
        fetchPercentageData();
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
                        Para analisá-lo corretamente, observe a altura de cada camada no gráfico, que representa a contribuição de um rótulo
                        específico em relação ao total acumulado. A soma de todas as camadas em um determinado período reflete o valor total
                        acumulado até aquele momento.
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
                        Este gráfico de Média Móvel Simples utiliza uma técnica estatística para suavizar as variações dos dados ao longo do
                        tempo, calculando a média dos valores de um conjunto de períodos consecutivos. A principal vantagem desta abordagem
                        é eliminar flutuações de curto prazo, revelando tendências mais estáveis e padrões que poderiam ser obscurecidos
                        pelas variações naturais dos dados.
                    </Typography>
                    <Typography variant="body2" sx={{ padding: '10px' }}>
                        Para analisá-lo corretamente, observe que cada ponto do gráfico representa a média dos valores de um número fixo de
                        períodos anteriores. Dessa forma, ele suaviza os picos e vales dos dados brutos, proporcionando uma visão mais clara
                        da direção geral e das tendências de longo prazo. Esse tipo de análise é ideal para identificar se uma variável está
                        aumentando ou diminuindo ao longo do tempo de forma mais consistente, ao invés de seguir um comportamento errático.
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
                        Este gráfico de percentual utiliza uma técnica de visualização que exibe os dados como uma proporção em relação ao
                        valor total, facilitando a análise das variações relativas ao longo do tempo. Ele é útil para identificar mudanças
                        na composição percentual de um dado conjunto, permitindo verificar, por exemplo, como diferentes categorias (como
                        áreas cultivadas) contribuem para o todo.
                    </Typography>
                    <Typography variant="body2" sx={{ padding: '10px' }}>
                        Para analisá-lo corretamente, observe as mudanças no valor percentual entre os períodos selecionados. A tendência de
                        aumento ou diminuição indica a variação da importância relativa de cada categoria ao longo do tempo. Este tipo de
                        gráfico é particularmente útil para comparações de categorias em diferentes períodos, ajudando a entender a dinâmica
                        de crescimento ou redução em termos proporcionais.
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
