// src/pages/AnalysisPage.tsx

import './AnalysisPage.css';
// import 'rsuite/SelectPicker/styles/index.css';
// import 'rsuite/DateRangePicker/styles/index.css';
import 'rsuite/dist/rsuite.min.css';

import { FC, useEffect, useState, SyntheticEvent } from 'react';

import {
    Box,
    SwipeableDrawer,
    FormControl,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Card,
    CardContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Button,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScienceIcon from '@mui/icons-material/Science';
import PaletteIcon from '@mui/icons-material/Palette';
import DateRangeIcon from '@mui/icons-material/DateRange';
import BiotechIcon from '@mui/icons-material/Biotech';
import MapIcon from '@mui/icons-material/Map';
import LabelIcon from '@mui/icons-material/Label';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';

import { iEstado, estados as mapStates, Map } from 'isagro-map';

import { buildAnalysisUrl, buildLabelsUrl, buildParamsUrl, buildSourceUrl, buildUrl } from '../pages/AnalysisHelper';

import { brownBackgroundColor, grayBackgroundColor, palettes, backgroundColors } from '../components/colors';

import { DateRangePicker } from 'rsuite';
import { Loader } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';
import { DateRange } from 'rsuite/esm/DateRangePicker';

import { IStackedAreaChart } from '../components/charts/IStackedAreaChart';
import { IPercentualAreaChart } from '../components/charts/IPercentualAreaChart';
import PercentualAreaChart from '../components/charts/PercentualAreaChart';
import { AnalysisProvider } from '../components/AnalysisProvider';
import Constants, { analysisDescriptions, Label } from './AnalysisConstants';
import { IAnalysisInfo } from './IAnalysisInfo';
import { findAnalysisDescription } from './AnalysisHelper';
import StackedAreaChart from '../components/charts/StackedAreaChart';
import BarChart from '../components/charts/BarChart';
import BarLineAreaComposedChart from '../components/charts/BarLineAreaComposedChart';
import PieChart from '../components/charts/PieChart';

export function Loading() {
    return (
        <div>
            <Loader backdrop content="loading..." vertical />
        </div>
    );
}

const AnalysisPage: FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [selectedSource, setSelectedSource] = useState<string>('');
    const [availableSources, setAvailableSources] = useState<[]>([]);

    const [availableAnalysis, setAvailableAnalysis] = useState<[]>([]);
    const [selectedAnalysis, setSelectedAnalysis] = useState<string>('GEE');

    const [labels, setLabels] = useState<Label[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<string>('');
    const [availableLabels, setAvailableLabels] = useState<[]>([]);

    const [selectedState, setSelectedState] = useState<string>('Distrito Federal');
    const [selectedMapState, setSelectedMapState] = useState<iEstado>(mapStates['Distrito Federal']);
    const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date('1990-01-01'));
    const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date('2024-01-31'));
    const [currentAnalysisDescription, setCurrentAnalysisDescription] = useState<IAnalysisInfo>(
        findAnalysisDescription(
            selectedAnalysis,
            selectedStartDate,
            selectedEndDate,
            analysisDescriptions(selectedStartDate, selectedEndDate),
        ),
    );
    const [selectedInterval, setSelectedInterval] = useState<string>('annual');
    const [selectedSumData, setSelectedSumData] = useState<IStackedAreaChart[]>([]);
    const [selectedSmaData, setSelectedSmaData] = useState<IStackedAreaChart[]>([]);
    const [selectedPercentualData, setSelectedPercentualData] = useState<IPercentualAreaChart[]>([]);

    const [selectedWidth, setSelectedWidth] = useState(Constants.initialConfig.width);
    const [selectedHeight, setSelectedHeight] = useState(Constants.initialConfig.height);

    const [selectedZoom, setSelectedZoom] = useState(selectedMapState.zoom);
    const [selectedBbox, setSelectedBbox] = useState<string>(Constants.initialConfig.bbox);
    const [selectedCenter, setSelectedCenter] = useState<string>();

    const [selectedPalette, setSelectedPalette] = useState<string>('greenDark');
    const [selectedBackgroundColor, setSelectedBackgroundColor] = useState<string>('brown');

    // Inicializar o palette com o verde claro, médio ou escuro
    const [selectedChartDefaultPalette, setSelectedChartDefaultPalette] = useState<string[]>(
        palettes.find((palette) => palette.value === 'greenDark')?.colors.map((color) => color.color) || [],
    );
    const [selectedChartDefaultBackgroundColor, setSelectedChartDefaultBackgroundColor] = useState<string>(brownBackgroundColor);

    const handlePaletteChange = (event: SelectChangeEvent) => {
        const selectedPaletteValue = event.target.value as string;
        setSelectedPalette(selectedPaletteValue);

        // Extrair apenas as cores da paleta selecionada
        const colors = palettes.find((palette) => palette.value === selectedPaletteValue)?.colors.map((color) => color.color);
        if (colors) {
            setSelectedChartDefaultPalette(colors);
        }
    };

    const handleBackgroundColors = (event: SelectChangeEvent) => {
        const selectedBgColorValue = event.target.value as string;
        setSelectedBackgroundColor(selectedBgColorValue);

        // Encontrar a cor de fundo com base na seleção do usuário
        const bgColor = backgroundColors.find((bgColor) => bgColor.value === selectedBgColorValue)?.bg;
        if (bgColor) {
            setSelectedChartDefaultBackgroundColor(bgColor); // Definir a cor de fundo no estado
        }
    };

    const handleStateChange = (event: SelectChangeEvent) => {
        const stateValue = event.target.value as string;
        setSelectedState(stateValue);
        const stateTaken = mapStates[stateValue];
        setSelectedMapState(stateTaken);
        setSelectedBbox(stateTaken.bbox.join(','));
        setSelectedZoom(stateTaken.zoom);
    };

    const handleIntervalChange = (event: SelectChangeEvent) => {
        setSelectedInterval(event.target.value); // Atualiza o intervalo selecionado
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
        console.log('[AnalysisPage] Análise selecionada:', selectedValue);

        // Busca os rótulos válidos com base na análise e mapeia-os para a exibição correta
        const validLabelValues: string[] = availableLabels
        console.log('[AnalysisPage] Rótulos válidos:', validLabelValues);

        const validLabelsForDisplay = availableLabels.filter((labelItem: string) => validLabelValues.includes(labelItem));
        setLabels(validLabelsForDisplay);
    };

    const handleLabelChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value as string;
        setSelectedLabel(selectedValue); // Atualiza o estado do rótulo selecionado
        console.log('[AnalysisPage] Rótulo selecionado:', selectedValue);
    };

    const requestStackedData = async (url: string): Promise<IStackedAreaChart[]> => {
        console.log(`[AnalysisPage] requestStackedData ${url}`);
        return fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('[AnalysisPage] requestStackedData Falha ao buscar os dados!');
                }
                return response.json(); // Convertendo a resposta para JSON
            })
            .then((stackedObjects: IStackedAreaChart[]) => {
                console.log(`[AnalysisPage] requestStackedData result: ${stackedObjects.length}`);
                return stackedObjects; // Retornando os dados para a função chamadora
            })
            .catch((error) => {
                console.error('[AnalysisPage] requestStackedData Erro ao buscar os dados:', error);
                return []; // Em caso de erro, retornar array vazio para evitar falhas
            });
    };

    const requestMenu = async (url: string): Promise<[]> => {
        console.log(`[AnalysisPage] requestMenu ${url}`);
        return fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('[AnalysisPage] requestMenu Falha ao buscar os dados!');
                }
                return response.json(); // Convertendo a resposta para JSON
            })
            .then((items: []) => {
                console.log(`[AnalysisPage] requestMenu result: ${items.length}`);
                return items; // Retornando os dados para a função chamadora
            })
            .catch((error) => {
                console.error('[AnalysisPage] requestMenu Erro ao buscar os dados:', error);
                return []; // Em caso de erro, retornar array vazio para evitar falhas
            });
    };

    useEffect(() => {

        buildLabelsUrl(selectedAnalysis).then((url) => {
            requestMenu(url).then((objects) => {
                console.log(`[AnalysisPage] useEffect availableLabels: ${url}`);
                console.log(`[AnalysisPage] useEffect availableLabels result: ${objects.length}`);
                console.log(`[AnalysisPage] useEffect availableLabels sample: ${JSON.stringify(objects?.slice(0, 2), null, 2)}`);
                setAvailableLabels(objects);
            });
        });

        buildUrl('sma', selectedStartDate, selectedEndDate, selectedAnalysis, selectedInterval).then((smaUrl) => {
            requestStackedData(smaUrl).then((stackedObjects) => {
                console.log(`[AnalysisPage] useEffect url: ${smaUrl}`);
                console.log(`[AnalysisPage] useEffect sma result: ${stackedObjects.length}`);
                console.log(`[AnalysisPage] useEffect sma sample: ${JSON.stringify(stackedObjects?.slice(0, 2), null, 2)}`);
                setSelectedSmaData(stackedObjects);
            });
        });

        buildUrl('sum', selectedStartDate, selectedEndDate, selectedAnalysis, selectedInterval).then((sumUrl) => {
            requestStackedData(sumUrl).then((stackedObjects) => {
                console.log(`[AnalysisPage] useEffect url: ${sumUrl}`);
                console.log(`[AnalysisPage] useEffect sum result: ${stackedObjects.length}`);
                console.log(`[AnalysisPage] useEffect sum sample: ${JSON.stringify(stackedObjects?.slice(0, 2), null, 2)}`);
                setSelectedSumData(stackedObjects);
            });
        });

        buildUrl('percentage', selectedStartDate, selectedEndDate, selectedAnalysis, selectedInterval).then((percentageUrl) => {
            requestStackedData(percentageUrl).then((stackedObjects) => {
                console.log(`[AnalysisPage] useEffect url: ${percentageUrl}`);
                console.log(`[AnalysisPage] useEffect percentage result: ${stackedObjects.length}`);
                console.log(`[AnalysisPage] useEffect percentage sample: ${JSON.stringify(stackedObjects?.slice(0, 2), null, 2)}`);
                // Transformando de IStackedAreaChart para IPercentualAreaChart
                const percentualObjects: IPercentualAreaChart[] = stackedObjects.map((item) => ({
                    period: item.period,
                    value: parseFloat(item.entry[1].toString()), // Pega diretamente o valor de entry[1] como percentual
                }));
                setSelectedPercentualData(percentualObjects);
            });
        });

        const analysisInfos = analysisDescriptions(selectedStartDate, selectedEndDate);
        const initialAnalysisDescription = findAnalysisDescription(selectedAnalysis, selectedStartDate, selectedEndDate, analysisInfos);
        setCurrentAnalysisDescription(initialAnalysisDescription);
    }, [selectedAnalysis, selectedLabel, selectedStartDate, selectedEndDate, selectedState, selectedSource, selectedInterval]);

    useEffect(() => {

        buildAnalysisUrl().then((url) => {
            requestMenu(url).then((objects) => {
                console.log(`[AnalysisPage] useEffect availableAnalysis: ${url}`);
                console.log(`[AnalysisPage] useEffect availableAnalysis result: ${objects.length}`);
                console.log(`[AnalysisPage] useEffect availableAnalysis sample: ${JSON.stringify(objects?.slice(0, 2), null, 2)}`);
                setAvailableAnalysis(objects);
            });
        });

        buildSourceUrl().then((url) => {
            requestMenu(url).then((objects) => {
                console.log(`[AnalysisPage] useEffect availableSources: ${url}`);
                console.log(`[AnalysisPage] useEffect availableSources result: ${objects.length}`);
                console.log(`[AnalysisPage] useEffect availableSources sample: ${JSON.stringify(objects?.slice(0, 2), null, 2)}`);
                setAvailableSources(objects);
            });
        });

    }, []);

    const toggleDrawer = (newOpen: boolean) => () => {
        setDrawerOpen(newOpen);
    };

    return (
        <AnalysisProvider>
            <Button
                onClick={toggleDrawer(true)}
                sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                }} >
                <MoreVertIcon />
            </Button>
            {ParamsSwipeableDrawer(drawerOpen, toggleDrawer, selectedStartDate, selectedEndDate, handleChangeRangeDates, selectedState, handleStateChange, selectedAnalysis, handleAnalysisChange, availableAnalysis, selectedLabel, handleLabelChange, availableLabels, selectedSource, handleSourceChange, availableSources, selectedInterval, handleIntervalChange, selectedBackgroundColor, handleBackgroundColors, selectedPalette, handlePaletteChange)}
            <div>

            {MapBox(selectedMapState,
                        selectedWidth,
                        selectedHeight,
                        currentAnalysisDescription,
                        (zoom: number) => setSelectedZoom(zoom),
                        (b: Array<number>) => setSelectedBbox(b.join(', ')),
                        (c: Array<number>) => setSelectedCenter(c.join(', '))
            )}

                <Paper sx={{ width: '98%', alignItems: 'center', padding: '5px', margin: '5px', marginRight: '30px' }}>
                    <Typography variant="h3" sx={{ padding: '15px', marginTop: '15px' }}>
                        Soma agregada na linha do tempo
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

                    {StackedAreaChartCard(selectedChartDefaultBackgroundColor, currentAnalysisDescription, selectedStartDate, selectedEndDate, selectedSumData, selectedChartDefaultPalette)}

                    <Typography variant="h3" sx={{ padding: '15px', marginTop: '15px' }}>
                        Média Móvel Simples
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

                    {StackedAreaChartCard(selectedChartDefaultBackgroundColor, currentAnalysisDescription, selectedStartDate, selectedEndDate, selectedSmaData, selectedChartDefaultPalette)}

                    <Typography variant="h3" sx={{ padding: '15px', marginTop: '15px' }}>
                        Percentuais na linha do tempo
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

                    {PercentualAreaChartCard(selectedChartDefaultBackgroundColor, currentAnalysisDescription, selectedAnalysis, selectedStartDate, selectedEndDate, selectedPercentualData, selectedChartDefaultPalette)}
                </Paper>
            </div>
        </AnalysisProvider>
    );
};

export default AnalysisPage;

function ParamsSwipeableDrawer(_drawerOpen: boolean,
                                _toggleDrawer: (newOpen: boolean) => () => void,
                                _startDate: Date,
                                _endDate: Date,
                                _handleChangeRangeDates: (rangeDates: DateRange | null, event: SyntheticEvent<Element, Event>) => void,
                                _state: string,
                                _handleStateChange: (event: SelectChangeEvent) => void,
                                _indicator: string,
                                _handleAnalysisChange: (event: SelectChangeEvent<string>) => void,
                                _availableIndicators: [],
                                _label: string,
                                _handleLabelChange: (event: SelectChangeEvent<string>) => void,
                                _availableLabels: [],
                                _source: string,
                                _handleSourceChange: (event: SelectChangeEvent) => void,
                                _availableSources: [],
                                _interval: string,
                                _handleIntervalChange: (event: SelectChangeEvent) => void,
                                _backgroundColor: string,
                                _handleBackgroundColors: (event: SelectChangeEvent) => void,
                                _palette: string,
                                _handlePaletteChange: (event: SelectChangeEvent) => void) {
    return (
            <SwipeableDrawer anchor={'right'}
                open={_drawerOpen}
                onClose={_toggleDrawer(false)}
                onOpen={_toggleDrawer(true)}>
                <Box sx={{ alignItems: 'center' }}>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="period-content" id="period-header">
                            <List dense>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <CalendarMonthIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Período"
                                        secondary={`${_startDate.getFullYear()} até ${_endDate.getFullYear()}`} />
                                </ListItem>
                            </List>
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
                                    onChange={_handleChangeRangeDates} />
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="estado-content" id="estado-header">
                            <List dense>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <MapIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Estado" secondary={`${_state}`} />
                                </ListItem>
                            </List>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>Ao selecionar um estado, o mapa deve exibir a imagem correspondente.</Typography>
                            <Divider variant="middle" sx={{ margin: '15px' }} />
                            <FormControl fullWidth>
                                <Select id="state-select" value={_state} onChange={_handleStateChange}>
                                    <MenuItem value="">
                                        <em>Não informado</em>
                                    </MenuItem>
                                    {Object.keys(mapStates).map((e, index) => (
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
                            <List dense>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <BiotechIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Indicador" secondary={`${_indicator}`} />
                                </ListItem>
                            </List>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>Ao selecionar uma análise, os gráficos devem exibir os dados correspondentes.</Typography>
                            <Divider variant="middle" sx={{ margin: '15px' }} />
                            <FormControl fullWidth>
                                <Select id="analysis-select" value={_indicator} onChange={_handleAnalysisChange}>
                                    {_availableIndicators?.map((analysis: string) => (
                                        <MenuItem
                                            id={`${analysis}-menu-item-analysis`}
                                            value={analysis}
                                            key={analysis}
                                        >
                                            {analysis}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="label-content" id="label-header">
                            <List dense>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <LabelIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Rótulo" secondary={`${_label}`} />
                                </ListItem>
                            </List>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>Ao selecionar um rótulo, os gráficos devem exibir os dados correspondentes.</Typography>
                            <Divider variant="middle" sx={{ margin: '15px' }} />
                            <FormControl fullWidth>
                                <Select id="analysis-select" value={_label} onChange={_handleLabelChange}>
                                    <MenuItem value="">
                                        <em>Não informado</em>
                                    </MenuItem>
                                    {_availableLabels.map((labelItem: string, index: number) => (
                                        <MenuItem id={`${index}-menu-item-label`} value={labelItem} key={index}>
                                            {labelItem}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="source-content" id="source-header">
                            <List dense>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ScienceIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Fonte" secondary={`${_source}`} />
                                </ListItem>
                            </List>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>Ao selecionar uma fonte, os gráficos devem exibir os dados correspondentes.</Typography>
                            <Divider variant="middle" sx={{ margin: '15px' }} />
                            <FormControl fullWidth>
                                <Select id="source-select" value={_source} onChange={_handleSourceChange}>
                                    <MenuItem value="">
                                        <em>Não informado</em>
                                    </MenuItem>
                                    {_availableSources.map((source: string) => (
                                        <MenuItem id={`${source}-menu-item-source`} value={source} key={source}>
                                            {source}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="interval-content" id="interval-header">
                            <List dense>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <DateRangeIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Intervalo" secondary={`${_interval}`} />
                                </ListItem>
                            </List>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>Selecione o intervalo para a análise (anual, bienal, etc.).</Typography>
                            <Divider variant="middle" sx={{ margin: '15px' }} />
                            <FormControl fullWidth>
                                <Select id="interval-select" value={_interval} onChange={_handleIntervalChange}>
                                    <MenuItem value="annual">Anual</MenuItem>
                                    <MenuItem value="biennial">Bienal</MenuItem>
                                    <MenuItem value="triennial">Trienal</MenuItem>
                                    <MenuItem value="quadrennial">Quadrienal</MenuItem>
                                    <MenuItem value="quinquennial">Quinquenal</MenuItem>
                                </Select>
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="palettes-content" id="palettes-header">
                            <List dense>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <PaletteIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Cor de fundo"
                                        secondary={backgroundColors.find((bgColor) => bgColor.value === _backgroundColor)?.label} />
                                </ListItem>
                            </List>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>Ao selecionar uma paleta, os gráficos devem exibir as cores correspondentes.</Typography>
                            <Divider variant="middle" sx={{ margin: '15px' }} />
                            <FormControl fullWidth>
                                <Divider variant="middle" sx={{ margin: '15px' }} />
                                <Typography>Ao selecionar uma cor de fundo, os gráficos devem exibir a core correspondente.</Typography>
                                <Select id="palettes-select" value={_backgroundColor} onChange={_handleBackgroundColors}>
                                    <MenuItem value="">
                                        <em>Não informado</em>
                                    </MenuItem>
                                    {backgroundColors.map((bgColors) => (
                                        <MenuItem
                                            id={`${bgColors.value}-menu-item-palette`}
                                            value={bgColors.value}
                                            key={bgColors.value}
                                        >
                                            {bgColors.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="palettes-content" id="palettes-header">
                            <List dense>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <FormatColorFillIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Paleta"
                                        secondary={palettes.find((palette) => palette.value === _palette)?.label} />
                                </ListItem>
                            </List>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Divider variant="middle" sx={{ margin: '15px' }} />
                            <Typography>Ao selecionar uma paleta, os gráficos devem exibir as cores correspondentes.</Typography>
                            <FormControl fullWidth>
                                <Select id="palettes-select" value={_palette} onChange={_handlePaletteChange}>
                                    <MenuItem value="">
                                        <em>Não informado</em>
                                    </MenuItem>
                                    {palettes.map((palette) => (
                                        <MenuItem id={`${palette.value}-menu-item-palette`} value={palette.value} key={palette.value}>
                                            {palette.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </SwipeableDrawer>
    );
}

function MapBox(selectedMapState: iEstado,
                    selectedWidth: number,
                    selectedHeight: number,
                    currentAnalysisDescription: IAnalysisInfo,
                    _setSelectedZoom: (zoom: number) => void|undefined,
                    _setSelectedBbox: (b: Array<number>) => void|undefined,
                    _setSelectedCenter: (c: Array<number>) => void|undefined
                ) {
    return (<Box sx={{ display: 'flex', '& > :not(style)': { m: 1 } }}>
                <Box sx={{ flexGrow: 1, margin: '30px', padding: '30px' }}>
                    <Typography variant="h2" sx={{ padding: '15px' }}>
                        <img src="/logo-isagro.png" alt="Logo Isagro" style={{ width: '150px', height: 'auto', margin: '15px' }} />
                        Indicadores agro-socioambientais do Brasil
                    </Typography>
                    <Typography variant="h4" sx={{ padding: '15px' }}>
                        Inteligência estratégica para a sustentabilidade da agropecuária nacional
                    </Typography>
                    <div style={{ border: 5, borderColor: grayBackgroundColor }}>
                        <Map
                            estado={selectedMapState}
                            width={selectedWidth}
                            height={selectedHeight}
                            coordinateOnClick={(coordinate: Array<number>) => alert(`Coordenada do clique: ${coordinate}`)}
                            onZoomChange={_setSelectedZoom}
                            onBboxChange={_setSelectedBbox}
                            onCenterChange={_setSelectedCenter}
                            version="1.3.0"
                            request="GetMap"
                            srs="EPSG:4326"
                            layers="CCAR:BCIM_Unidade_Federacao_A"
                            format="image/jpeg"
                            transparent={false}
                            bgcolor="0xFFFFFF" />
                    </div>
                    <Typography variant="h3" sx={{ padding: '10px' }}>
                        {currentAnalysisDescription?.title || 'Informações Detalhadas da Análise'}
                    </Typography>
                </Box>
            </Box>);
}

function PercentualAreaChartCard(_defaultBackgroundColor: string, _indicatorDescription: IAnalysisInfo, _indicator: string, _startDate: Date, _endDate: Date, _data: IPercentualAreaChart[], _defaultPalette: string[]) {
    return <Card
        variant="outlined"
        sx={{ alignItems: 'center', width: '98%', backgroundColor: _defaultBackgroundColor, margin: '10px' }}
    >
        <CardContent>
            <Typography variant="h6" sx={{ padding: '15px' }}>
                {_indicatorDescription?.title || _indicator} por período{' '}
                {`${_startDate.getFullYear()} à ${_endDate.getFullYear()}`}
            </Typography>
            <Typography variant="body2" sx={{ padding: '10px' }}>
                {_indicatorDescription?.description}
            </Typography>
            <PercentualAreaChart
                width={400}
                height={250}
                data={_data}
                valueLabel="Área"
                fillColor={_defaultPalette[_defaultPalette.length % _defaultPalette.length]}
                strokeColor={_defaultPalette[_defaultPalette.length % _defaultPalette.length]} />
        </CardContent>
    </Card>;
}

function StackedAreaChartCard(_defaultBackgroundColor: string,
                        _indicatorDescription: IAnalysisInfo,
                        _startDate: Date, selectedEndDate: Date,
                        _data: IStackedAreaChart[],
                        _chartDefaultPalette: string[]) {
    return <Card
        variant="outlined"
        sx={{ alignItems: 'center', width: '98%', backgroundColor: _defaultBackgroundColor, margin: '10px' }}
    >
        <CardContent>
            <Typography variant="h6" sx={{ padding: '15px' }}>
                {_indicatorDescription?.title} por período{' '}
                {`${_startDate.getFullYear()} à ${selectedEndDate.getFullYear()}`}
            </Typography>
            <Typography variant="body2" sx={{ padding: '10px' }}>
                {_indicatorDescription?.description}
            </Typography>

            <StackedAreaChart
                width={400}
                height={250}
                data={_data}
                defaultPalette={_chartDefaultPalette} />
        </CardContent>
    </Card>;
}

