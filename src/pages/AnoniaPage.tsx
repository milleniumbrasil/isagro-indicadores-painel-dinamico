// src/pages/AnoniaPage.tsx

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

import { buildAnalysisUrl, buildLabelsUrl, buildParamsUrl, buildSourceUrl, buildUrl } from './AnalysisHelper';

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
import { isEdge } from 'rsuite/esm/internals/utils';

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
    const [selectedAnalysis, setSelectedAnalysis] = useState<string>('NH3');

    const [labels, setLabels] = useState<Label[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<string>('');
    const [availableLabels, setAvailableLabels] = useState<[]>([]);

    const [selectedState, setSelectedState] = useState<string>('Distrito Federal');
    const [selectedMapState, setSelectedMapState] = useState<iEstado>(mapStates['Distrito Federal']);

    const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date(2000, 0, 1)); // Janeiro é o mês 0
    const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date('2024-12-31'));

    const [isTextExpanded, setIsTextExpanded] = useState(false);

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

    const handleChangeRangeDates = (rangeDates: DateRange | null) => {
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
        const updatedStartDate = new Date(selectedStartDate);
        updatedStartDate.setFullYear(parseInt(selectedValue));
        setSelectedStartDate(updatedStartDate); // Atualiza o estado da data inicial selecionada
        console.log('[AnalysisPage] Data Inicial selecionada:', updatedStartDate);
    };

    const handleEndDateChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value as string;
        const updatedEndDate = new Date(selectedEndDate);
        updatedEndDate.setFullYear(parseInt(selectedValue));
        setSelectedEndDate(new Date(updatedEndDate)); // Atualiza o estado da data final selecionada
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
        if (selectedStartDate && selectedEndDate){

        buildUrl('sum', selectedStartDate, selectedEndDate, selectedAnalysis, selectedInterval).then((sumUrl) => {
            requestStackedData(sumUrl).then((stackedObjects) => {
                console.log(`[AnalysisPage] useEffect url: ${sumUrl}`);
                console.log(`[AnalysisPage] useEffect sum result: ${stackedObjects.length}`);
                console.log(`[AnalysisPage] useEffect sum sample: ${JSON.stringify(stackedObjects?.slice(0, 2), null, 2)}`);
                setSelectedSumData(stackedObjects);
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
        }
        const analysisInfos = analysisDescriptions(selectedStartDate, selectedEndDate);
        const initialAnalysisDescription = findAnalysisDescription(selectedAnalysis, selectedStartDate, selectedEndDate, analysisInfos);
        setCurrentAnalysisDescription(initialAnalysisDescription);
    }, [selectedStartDate, selectedEndDate, selectedAnalysis, selectedInterval]);

    useEffect(() => {
        // recupera os itens de menû para os estados e as indicadores
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

    useEffect(() => {
        // recupera os rotulos disponíveis para o indicador selecionado
        buildLabelsUrl(selectedAnalysis).then((url) => {
            requestMenu(url).then((objects) => {
                console.log(`[AnalysisPage] useEffect availableLabels: ${url}`);
                console.log(`[AnalysisPage] useEffect availableLabels result: ${objects.length}`);
                console.log(`[AnalysisPage] useEffect availableLabels sample: ${JSON.stringify(objects?.slice(0, 2), null, 2)}`);
                setAvailableLabels(objects);
            });
        });
    }, [selectedAnalysis]);

    useEffect(() => {
        // obtém os dados descritivos para as datas selecionadas
        if (selectedStartDate && selectedEndDate) {
            const analysisInfos = analysisDescriptions(selectedStartDate, selectedEndDate);
            const initialAnalysisDescription = findAnalysisDescription(
                selectedAnalysis,
                selectedStartDate,
                selectedEndDate,
                analysisInfos
            );
            setCurrentAnalysisDescription(initialAnalysisDescription);
        }
    }, [selectedStartDate, selectedEndDate, selectedAnalysis, selectedInterval]);

    const toggleDrawer = (newOpen: boolean) => () => {
        setDrawerOpen(newOpen);
    };

    const toggleTextExpansion = (expand: boolean) => {
        setIsTextExpanded(expand);
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
            { <ParamsSwipeableDrawer
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
                    _handlePaletteChange={handlePaletteChange} /> }
            <div>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', '& > :not(style)': { m: 1 }, margin: '30px', padding: '30px' }}>
                <Typography variant="h2" sx={{ paddingRight: '15px' }}>
                    Indicadores de NH3 Amônia
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', '& > :not(style)': { m: 1 }, width: '100%' }}>
                <Box sx={{ flexGrow: 1, width: '50%', margin: '30px', padding: '30px' }}>
                    {MapBox(selectedMapState,
                            selectedWidth,
                            selectedHeight,
                            (zoom: number) => setSelectedZoom(zoom),
                            (bbox: Array<number>) => setSelectedBbox(bbox.join(', ')),
                            (center: Array<number>) => setSelectedCenter(center.join(', ')) )}
                </Box>
                <Box sx={{ flexGrow: 1, width: '50%', margin: '30px', padding: '30px' }}>
                    {SideBox(selectedState,
                                        selectedStartDate.getFullYear().toString(),
                                        selectedEndDate.getFullYear().toString(),
                                        selectedAnalysis,
                                        selectedLabel,
                                        selectedSource,
                                        selectedInterval,
                                        selectedBackgroundColor,
                                        selectedPalette,
                                        isTextExpanded,
                                        toggleTextExpansion)}
                </Box>
            </Box>

            <Paper sx={{ width: '96%', alignItems: 'center', margin: '15px' }}>
                <Box sx={{ display: 'flex', '& > :not(style)': { m: 1 } }}>

                    {BarChartCard(
                                150, 200,
                                selectedChartDefaultBackgroundColor,
                                selectedStartDate,
                                selectedEndDate,
                                selectedSmaData,
                                selectedChartDefaultPalette)
                                }
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

function SideBox(   _stateName: string,
                    _startDate: string,
                    _endDate: string,
                    _indicator: string,
                    _label: string,
                    _source: string,
                    _interval: string,
                    _backgroundColor: string,
                    _palette: string,
                    _isTextExpanded: boolean,
                    _toggleTextExpansion : (expand: boolean) => void|undefined
                ) {
    return (
                <Box sx={{ margin: '10px' }}>
                    <Typography
                            variant="body2"
                            style={{
                                padding: '15px',
                                margin: '15px',
                                overflow: _isTextExpanded ? 'visible' : 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: _isTextExpanded ? 'unset' : 15, // Limita o numero de linhas quando não expandido
                                WebkitBoxOrient: 'vertical',
                                transition: 'height 0.3s ease'
                            }}>

                        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                            <li><b>Estado:</b> {_stateName}</li>
                            <li><b>Indicador:</b> {_indicator}</li>
                        </ul>
                        <p>
                        O uso de fertilizantes e adubos para suprir as plantas com nitrogênio, assim como a urina e as fezes de bovinos, suínos, aves, entre outros integrantes de rebanho, são fontes de amônia, um gás que polui a atmosfera e traz impactos negativos para áreas naturais e para o homem. A amônia que é emitida para a atmosfera pode retornar aos ambientes naturais, como florestas e corpos d’água, provocando perda de biodiversidade e eutrofização, assim como produzir material particulado capaz de afetar fortemente a saúde da população. A agropecuária é a fonte de amônia mais importante para a maioria dos países, inclusive o Brasil, e o monitoramento das emissões deve ser realizado visando identificar os principais gargalos e mitigar o problema.
                        Com o IS_Agro, a emissão de amônia no Brasil será quantificada em diferentes escalas territoriais, utilizando dados disponíveis e também pelo levantamento de novos dados e informações que serão consumidas automaticamente para os cálculos de acordo com critérios ajustados às condições tropicais. Estudos adicionais vem sendo realizados considerando a alta complexidade encontrada no procedimento metodológico, que requer a validação para então ser proposto em fóruns globais.
                        O inventário da emissão de NH3 para a agricultura, seguindo as diretrizes da EMEP de 2019 e do IPCC de 2006 e 2019, utilizadas juntamente com os dados da ANDA para fertilizantes, e do IBGE para rebanhos, além de várias outras fontes, como a literatura científica, foram usados para complementar informações para elaborar um inventário usando uma abordagem mais avançada. Esses números vêm sendo atualizados periodicamente.
                        As emissões de amônia no Brasil aumentaram de 2,28 milhões de toneladas em 1990 para 3,89 milhões de toneladas em 2021. Seguiram uma tendência crescente de 1990 a 2015, e desde então seguem uma tendência de estabilização. A pecuária foi responsável por cerca de dois terços do total das emissões. Uma nota técnica (ALVES et al., 2023a) foi formulada e submetida pela Embrapa/DEPI ao MAPA para endosso e encaminhamento a OCDE em setembro de 2023. Atividade executada por Bruno Alves (Embrapa Agrobiologia) atualizado para o período 1990-2021.
                        </p>
                        <p>
                        "ALVES, B.J.R.; URQUIAGA, S.  POLIDORO, J.C.; FREITAS, P.L.de. Ammonia Emissions from Brazilian Agriculture - 1990 – 2021.  Technical Note. 7 pag. Setembro 2023.
                        https://drive.google.com/file/d/15tZSBHiGKUn1a2uoI4MfTYAWt9pFIZa8/view?usp=drive_link"
                        </p>
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <Button onClick={() => _toggleTextExpansion(!_isTextExpanded)}>
                            {_isTextExpanded ? 'Ver menos' : 'Ver mais'}
                        </Button>
                    </Box>
                </Box>
    );
}
function BarChartCard(  _width: number,
                        _height: number,
                        _defaultBackgroundColor: string,
                        _startDate: Date,
                        _endDate: Date,
                        _data: IStackedAreaChart[],
                        _palette: string[]) {
    return (
        <>
            <Card variant="outlined" sx={{ alignItems: 'center', width: '100%', backgroundColor: _defaultBackgroundColor }} >
                <CardContent>
                    <BarLineAreaComposedChart
                        width={_width}
                        height={_height}
                        data={_data}
                        tendencyData={_data}/>
                </CardContent>
            </Card>
        </>
    );
}

