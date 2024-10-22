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
import { BsCalendar2MonthFill } from 'react-icons/bs';
import { Loader } from 'rsuite';
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
import ParamsSwipeableDrawer from '../components/ParamsSwipeableDrawer';

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

    const handleStartDateChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value as string;
        setSelectedStartDate(new Date(selectedValue)); // Atualiza o estado da data inicial selecionada
        console.log('[AnalysisPage] Data Inicial selecionada:', selectedValue);
    };

    const handleEndDateChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value as string;
        setSelectedEndDate(new Date(selectedValue)); // Atualiza o estado da data final selecionada
        console.log('[AnalysisPage] Data Final selecionada', selectedValue);
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
            <ParamsSwipeableDrawer
                    _drawerOpen={drawerOpen}
                    _toggleDrawer={toggleDrawer}
                    _startDate={selectedStartDate}
                    _endDate={selectedEndDate}
                    _state={selectedState}
                    _indicator={selectedAnalysis}
                    _availableIndicators={availableAnalysis}
                    _label={selectedLabel}
                    _availableLabels={availableLabels}
                    _source={selectedSource}
                    _availableSources={availableSources}
                    _interval={selectedInterval}
                    _backgroundColor={selectedBackgroundColor}
                    _palette={selectedPalette}
                    _handleStateChange={handleStateChange}
                    _handleAnalysisChange={handleAnalysisChange}
                    _handleLabelChange={handleLabelChange}
                    _handleStartDateChange={handleStartDateChange}
                    _handleEndDateChange={handleEndDateChange}
                    _handleSourceChange={handleSourceChange}
                    _handleIntervalChange={handleIntervalChange}
                    _handleBackgroundColors={handleBackgroundColors}
                    _handlePaletteChange={handlePaletteChange} />
            <div>

            <Box sx={{ display: 'flex', '& > :not(style)': { m: 1 } }}>
                <Box sx={{ flexGrow: 1, margin: '30px', padding: '30px' }}>
                    <Typography variant="h2" sx={{ padding: '15px' }}>
                        <img src="/logo-isagro.png" alt="Logo Isagro" style={{ width: '150px', height: 'auto', margin: '15px' }} />
                        Indicadores agro-socioambientais do Brasil
                    </Typography>
                    <Typography variant="h4" sx={{ padding: '15px' }}>
                        Inteligência estratégica para a sustentabilidade da agropecuária nacional
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', '& > :not(style)': { m: 1 } }}>
                {MapBox(selectedMapState,
                        selectedWidth,
                        selectedHeight,
                        (zoom: number) => setSelectedZoom(zoom),
                        (bbox: Array<number>) => setSelectedBbox(bbox.join(', ')),
                        (center: Array<number>) => setSelectedCenter(center.join(', ')) )}
                {DashboardParamsBox(selectedState,
                                    selectedStartDate.getFullYear().toString(),
                                    selectedEndDate.getFullYear().toString(),
                                    selectedAnalysis,
                                    selectedLabel,
                                    selectedSource,
                                    selectedInterval,
                                    selectedBackgroundColor,
                                    selectedPalette)}
            </Box>

            <Box sx={{ display: 'flex', '& > :not(style)': { m: 1 } }}>
                <Box sx={{ flexGrow: 1, margin: '30px', padding: '30px' }}>
                    <Typography variant="h3" sx={{ padding: '10px' }}>
                        {currentAnalysisDescription?.title || 'Informações Detalhadas da Análise'}
                    </Typography>
                </Box>
            </Box>

            <Paper sx={{ width: '96%', alignItems: 'center', margin: '15px' }}>
                <Box sx={{ display: 'flex', '& > :not(style)': { m: 1 } }}>
                    {BarChartCard("",
                                150, 200,
                                selectedChartDefaultBackgroundColor,
                                currentAnalysisDescription,
                                selectedStartDate,
                                selectedEndDate,
                                selectedSumData,
                                selectedChartDefaultPalette)}
                </Box>
            </Paper>
            <Paper sx={{ width: '96%', alignItems: 'center', margin: '15px' }}>
                <Box sx={{ display: 'flex', '& > :not(style)': { m: 1 } }}>
                    {BarChartCard("",
                                150, 200,
                                selectedChartDefaultBackgroundColor,
                                currentAnalysisDescription,
                                selectedStartDate,
                                selectedEndDate,
                                selectedSumData,
                                selectedChartDefaultPalette)}
                </Box>
            </Paper>

            </div>
        </AnalysisProvider>
    );
};

export default AnalysisPage;


function MapBox(    _mapState: iEstado,
                    _width: number,
                    _height: number,
                    _setSelectedZoom: (zoom: number) => void|undefined,
                    _setSelectedBbox: (b: Array<number>) => void|undefined,
                    _setSelectedCenter: (c: Array<number>) => void|undefined
                ) {
    return (
            <Box sx={{ flexGrow: 1 }}>
                <Map
                    estado={_mapState}
                    width={_width}
                    height={_height}
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
            </Box>
    );
}

function DashboardParamsBox(
                    _stateName: string,
                    _startDate: string,
                    _endDate: string,
                    _indicator: string,
                    _label: string,
                    _source: string,
                    _interval: string,
                    _backgroundColor: string,
                    _palette: string,
                ) {
    return (
                <Box sx={{ margin: '10px' }}>
                    <Typography variant="h6" sx={{ padding: '15px' }}>
                    Parâmetros de pesquisa
                    </Typography>
                    <Typography variant="body2" sx={{ padding: '15px', width: '350px' }}>
                        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                            <li><b>Estado:</b> {_stateName}</li>
                            <li><b>Início:</b> {_startDate}</li>
                            <li><b>Fim:</b> {_endDate}</li>
                            <li><b>Indicador:</b> {_indicator}</li>
                            {_label ?? <li><b>Rótulo:</b> {_label}</li>}
                            {_source ?? <li><b>Fonte:</b> {_source}</li>}
                            {_interval ?? <li><b>Intervalo:</b> {_interval}</li>}
                            {_backgroundColor ?? <li><b>Fundo:</b> {_backgroundColor}</li>}
                            {_palette ?? <li><b>Paleta:</b> {_palette}</li>}
                        </ul>
                    </Typography>
                </Box>
    );
}

function PercentualAreaChartCard(   _title:string,
                                    _defaultBackgroundColor: string,
                                    _indicatorDescription: IAnalysisInfo,
                                    _indicator: string,
                                    _startDate: Date,
                                    _endDate: Date,
                                    _data: IPercentualAreaChart[],
                                    _defaultPalette: string[]
                                ) {
    return (
        <>
            <Typography variant="h5" sx={{ padding: '15px', marginTop: '15px' }}>
            {_title}
            </Typography>
            <Card
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
            </Card>
        </>
    );
}

function StackedAreaChartCard(  _title:string,
                                _padding: string,
                                _width: number,
                                _height: number,
                                _defaultBackgroundColor: string,
                                _indicatorDescription: IAnalysisInfo,
                                _startDate: Date, selectedEndDate: Date,
                                _data: IStackedAreaChart[],
                                _chartDefaultPalette: string[]) {
    return (
        <>
            <Typography variant="h5" sx={{ padding: _padding, marginTop: '10px' }}>
                {_title}
            </Typography>
            <Card
                variant="outlined"
                sx={{ alignItems: 'center', width: '100%', backgroundColor: _defaultBackgroundColor, margin: '10px' }}
            >
                <CardContent>
                    <Typography variant="h6" sx={{ padding: _padding }}>
                        {_indicatorDescription?.title} por período{' '}
                        {`${_startDate.getFullYear()} à ${selectedEndDate.getFullYear()}`}
                    </Typography>
                    <Typography variant="body2" sx={{ padding: _padding }}>
                        {_indicatorDescription?.description}
                    </Typography>

                    <StackedAreaChart
                        width={_width}
                        height={_height}
                        data={_data}
                        defaultPalette={_chartDefaultPalette} />
                </CardContent>
            </Card>

        </>
    );
}

function BarChartCard(  _title:string,
                        _width: number,
                        _height: number,
                        _defaultBackgroundColor: string,
                        _indicatorDescription: IAnalysisInfo,
                        _startDate: Date,
                        _endDate: Date,
                        _data: IStackedAreaChart[],
                        _palette: string[]) {
    return (
        <>
            <Typography variant="h5">
                {_title}
            </Typography>
            <Card variant="outlined" sx={{ alignItems: 'center', width: '100%', backgroundColor: _defaultBackgroundColor }} >
                <CardContent>
                    <Typography variant="h6">
                        {_indicatorDescription?.title} por período{' '}
                        {`${_startDate.getFullYear()} à ${_endDate.getFullYear()}`}
                    </Typography>
                    <Typography variant="body2">
                        {_indicatorDescription?.description}
                    </Typography>

                    <BarLineAreaComposedChart
                        width={_width}
                        height={_height}
                        data={_data}
                        defaultPalette={_palette} />
                </CardContent>
            </Card>
        </>
    );
}

