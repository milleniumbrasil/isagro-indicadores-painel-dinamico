// src/pages/DefaultIndicatorPage.tsx

import { FC, useEffect, useState } from 'react';

import {
    Box,
    Paper,
    SelectChangeEvent,
    Card,
    CardContent,
} from '@mui/material';

import { iEstado, estados as mapStates, Map } from 'isagro-map';

import { buildAnalysisUrl, buildLabelsUrl, buildSourceUrl, buildUrl } from './AnalysisHelper';

import { brownBackgroundColor, palettes, backgroundColors } from '../components/colors';

import { Loader } from 'rsuite';

import { IStackedAreaChart } from '../components/charts/IStackedAreaChart';
import { IPercentualAreaChart } from '../components/charts/IPercentualAreaChart';
import { AnalysisProvider } from '../components/AnalysisProvider';
import Constants, { Label } from './AnalysisConstants';
import BarLineAreaComposedChart from '../components/charts/BarLineAreaComposedChart';
import ParamsBar from '../components/ParamsBar';
import { useParams } from 'react-router-dom';
import { on } from 'events';

export function Loading() {
    return (
        <div>
            <Loader backdrop content="loading..." vertical />
        </div>
    );
}

const DefaultIndicatorPage: FC = () => {

    const { indicator } = useParams<{ indicator: string }>();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [selectedSource, setSelectedSource] = useState<string>('');
    const [availableSources, setAvailableSources] = useState<[]>([]);

    const [availableAnalysis, setAvailableAnalysis] = useState<[]>([]);
    const [selectedAnalysis, setSelectedAnalysis] = useState<string>(indicator || 'emissao-de-amonia');

    const [labels, setLabels] = useState<Label[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<string>('');
    const [availableLabels, setAvailableLabels] = useState<[]>([]);

    const [selectedState, setSelectedState] = useState<string>('Distrito Federal');
    const [selectedMapState, setSelectedMapState] = useState<iEstado>(mapStates['Distrito Federal']);

    const [selectedStartPeriod, setSelectedStartPeriod] = useState<Date>(new Date(2000, 0, 1)); // Janeiro é o mês 0
    const [selectedEndPeriod, setSelectedEndPeriod] = useState<Date>(new Date('2024-12-31'));

    const [selectedInterval, setSelectedInterval] = useState<string>('annual');
    const [annualSumData, setAnnualSumData] = useState<IStackedAreaChart[]>([]);
    const [selectedSumData, setSelectedSumData] = useState<IStackedAreaChart[]>([]);
    const [selectedLabelData, setSelectedLabelData] = useState<IStackedAreaChart[]>([]);
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

    const handleSourceChange = (event: SelectChangeEvent) => {
        const selectedValue = event.target.value as string;
        setSelectedSource(selectedValue);
    };

    const handleAnalysisChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value as string;
        setSelectedAnalysis(selectedValue);
        console.log('[DefaultIndicatorPage] Análise selecionada:', selectedValue);

        // Busca os rótulos válidos com base na análise e mapeia-os para a exibição correta
        const validLabelValues: string[] = availableLabels
        console.log('[DefaultIndicatorPage] Rótulos válidos:', validLabelValues);

        const validLabelsForDisplay = availableLabels.filter((labelItem: string) => validLabelValues.includes(labelItem));
        setLabels(validLabelsForDisplay);
    };

    const handleStartDateChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value as string;
        const updatedStartDate = new Date(selectedStartPeriod);
        updatedStartDate.setFullYear(parseInt(selectedValue));
        setSelectedStartPeriod(updatedStartDate); // Atualiza o estado da data inicial selecionada
        console.log('[DefaultIndicatorPage] Data Inicial selecionada:', updatedStartDate);
    };

    const handleEndDateChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value as string;
        const updatedEndDate = new Date(selectedEndPeriod);
        updatedEndDate.setFullYear(parseInt(selectedValue));
        setSelectedEndPeriod(new Date(updatedEndDate)); // Atualiza o estado da data final selecionada
        console.log('[DefaultIndicatorPage] Data Final selecionada', selectedValue);
    };

    const handleLabelChange = (newLabel: string | null) => {
        setSelectedLabel(newLabel ?? '');
    };

    const requestStackedData = async (url: string): Promise<IStackedAreaChart[]> => {
        console.log(`[DefaultIndicatorPage] requestStackedData ${url}`);
        return fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('[DefaultIndicatorPage] requestStackedData Falha ao buscar os dados!');
                }
                return response.json(); // Convertendo a resposta para JSON
            })
            .then((stackedObjects: IStackedAreaChart[]) => {
                console.log(`[DefaultIndicatorPage] requestStackedData result: ${stackedObjects.length}`);
                return stackedObjects; // Retornando os dados para a função chamadora
            })
            .catch((error) => {
                console.error('[DefaultIndicatorPage] requestStackedData Erro ao buscar os dados:', error);
                return []; // Em caso de erro, retornar array vazio para evitar falhas
            });
    };

    const requestMenu = async (url: string): Promise<[]> => {
        console.log(`[DefaultIndicatorPage] requestMenu ${url}`);
        return fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('[DefaultIndicatorPage] requestMenu Falha ao buscar os dados!');
                }
                return response.json(); // Convertendo a resposta para JSON
            })
            .then((items: []) => {
                console.log(`[DefaultIndicatorPage] requestMenu result: ${items.length}`);
                return items; // Retornando os dados para a função chamadora
            })
            .catch((error) => {
                console.error('[DefaultIndicatorPage] requestMenu Erro ao buscar os dados:', error);
                return []; // Em caso de erro, retornar array vazio para evitar falhas
            });
    };

    useEffect(() => {
        if (selectedStartPeriod && selectedEndPeriod){
            buildUrl('sum', selectedStartPeriod, selectedEndPeriod, selectedAnalysis, selectedInterval).then((sumUrl) => {
                requestStackedData(sumUrl).then((stackedObjects) => {
                    console.log(`[DefaultIndicatorPage] useEffect url: ${sumUrl}`);
                    console.log(`[DefaultIndicatorPage] useEffect sum result: ${stackedObjects.length}`);
                    console.log(`[DefaultIndicatorPage] useEffect sum sample: ${JSON.stringify(stackedObjects?.slice(0, 2), null, 2)}`);
                    setSelectedSumData(stackedObjects);
                });
            });
            buildUrl('sma', selectedStartPeriod, selectedEndPeriod, selectedAnalysis, selectedInterval).then((smaUrl) => {
                requestStackedData(smaUrl).then((stackedObjects) => {
                    console.log(`[DefaultIndicatorPage] useEffect url: ${smaUrl}`);
                    console.log(`[DefaultIndicatorPage] useEffect sma result: ${stackedObjects.length}`);
                    console.log(`[DefaultIndicatorPage] useEffect sma sample: ${JSON.stringify(stackedObjects?.slice(0, 2), null, 2)}`);
                    setSelectedSmaData(stackedObjects);
                });
            });
        }
    }, [selectedStartPeriod, selectedEndPeriod, selectedAnalysis, selectedInterval]);

    useEffect(() => {
        alert(`[DefaultIndicatorPage] useEffect selectedLabel: ${selectedLabel}`);
        if (selectedLabel && selectedStartPeriod && selectedEndPeriod) {
            buildUrl('sum', selectedStartPeriod, selectedEndPeriod, selectedAnalysis, selectedInterval, selectedLabel).then((sumUrl) => {
                requestStackedData(sumUrl).then((stackedObjects) => {
                    console.log(`[DefaultIndicatorPage] useEffect url: ${sumUrl}`);
                    console.log(`[DefaultIndicatorPage] useEffect sum result: ${stackedObjects.length}`);
                    console.log(`[DefaultIndicatorPage] useEffect sum sample: ${JSON.stringify(stackedObjects?.slice(0, 2), null, 2)}`);
                    setSelectedLabelData(stackedObjects);
                });
            });
        }
    } , [selectedLabel]);

    useEffect(() => {
        if (indicator) setSelectedAnalysis(indicator);
    }, [indicator]);

    useEffect(() => {
        if (selectedStartPeriod && selectedEndPeriod) {
            buildUrl('volume', selectedStartPeriod, selectedEndPeriod, selectedAnalysis, 'annual').then((sumUrl) => {
                requestStackedData(sumUrl).then((stackedObjects) => {
                    console.log(`[DefaultIndicatorPage] useEffect url: ${sumUrl}`);
                    console.log(`[DefaultIndicatorPage] useEffect volume result: ${stackedObjects.length}`);
                    console.log(`[DefaultIndicatorPage] useEffect volume sample: ${JSON.stringify(stackedObjects?.slice(0, 2), null, 2)}`);
                    setAnnualSumData(stackedObjects);
                });
            });
        }
    }, [selectedStartPeriod, selectedEndPeriod]);

    useEffect(() => {
        // recupera os itens de menû para os estados e as indicadores
        buildAnalysisUrl().then((url) => {
            requestMenu(url).then((objects) => {
                console.log(`[DefaultIndicatorPage] useEffect availableAnalysis: ${url}`);
                console.log(`[DefaultIndicatorPage] useEffect availableAnalysis result: ${objects.length}`);
                console.log(`[DefaultIndicatorPage] useEffect availableAnalysis sample: ${JSON.stringify(objects?.slice(0, 2), null, 2)}`);
                setAvailableAnalysis(objects);
            });
        });

        buildSourceUrl().then((url) => {
            requestMenu(url).then((objects) => {
                console.log(`[DefaultIndicatorPage] useEffect availableSources: ${url}`);
                console.log(`[DefaultIndicatorPage] useEffect availableSources result: ${objects.length}`);
                console.log(`[DefaultIndicatorPage] useEffect availableSources sample: ${JSON.stringify(objects?.slice(0, 2), null, 2)}`);
                setAvailableSources(objects);
            });
        });

    }, []);

    useEffect(() => {
        // recupera os rotulos disponíveis para o indicador selecionado
        buildLabelsUrl(selectedAnalysis).then((url) => {
            requestMenu(url).then((objects) => {
                console.log(`[DefaultIndicatorPage] useEffect availableLabels: ${url}`);
                console.log(`[DefaultIndicatorPage] useEffect availableLabels result: ${objects.length}`);
                console.log(`[DefaultIndicatorPage] useEffect availableLabels sample: ${JSON.stringify(objects?.slice(0, 2), null, 2)}`);
                setAvailableLabels(objects);
            });
        });
    }, [selectedAnalysis]);

    const toggleDrawer = (newOpen: boolean) => () => {
        setDrawerOpen(newOpen);
    };

    return (
        <AnalysisProvider>
            <div>

            <ParamsBar
                    _startDate={selectedStartPeriod}
                    _endDate={selectedEndPeriod}
                    _state={selectedState}
                    _interval={selectedInterval}
                    _handleStateChange={handleStateChange}
                    _handleStartDateChange={handleStartDateChange}
                    _handleEndDateChange={handleEndDateChange}
                    _handleIntervalChange={handleIntervalChange} />

            {/* <Paper sx={{ width: '96%', alignItems: 'center', margin: '15px' }}>
                <Box sx={{ display: 'flex', '& > :not(style)': { m: 1 } }}>

                    {BarLineChartCard(
                                150, 200,
                                selectedChartDefaultBackgroundColor,
                                selectedStartDate,
                                selectedEndDate,
                                annualSumData,
                                selectedSmaData,
                                selectedChartDefaultPalette)
                                }
                </Box>
            </Paper> */}

            <Paper sx={{ width: '96%', alignItems: 'center', margin: '15px' }}>
                <Box sx={{ display: 'flex', '& > :not(style)': { m: 1 } }}>

                    {BarChartCard(
                                150, 200,
                                selectedChartDefaultBackgroundColor,
                                selectedStartPeriod,
                                selectedEndPeriod,
                                selectedSumData,
                                selectedChartDefaultPalette,
                                handleLabelChange)}
                </Box>
                <Box sx={{ display: 'flex', '& > :not(style)': { m: 1 } }}>
                    {selectedLabelData && selectedLabelData.length > 0 && (BarChartCard(
                                150, 200,
                                selectedChartDefaultBackgroundColor,
                                selectedStartPeriod,
                                selectedEndPeriod,
                                selectedLabelData,
                                selectedChartDefaultPalette,
                                handleLabelChange))}
                </Box>
            </Paper>

            </div>
        </AnalysisProvider>
    );
};

export default DefaultIndicatorPage;

function BarChartCard(  _width: number,
                        _height: number,
                        _defaultBackgroundColor: string,
                        _startDate: Date,
                        _endDate: Date,
                        _data: IStackedAreaChart[],
                        _palette: string[],
                        _onSelectedLabel: (newLabel: string) => void) {
    return (
        <>
            <Card variant="outlined" sx={{ alignItems: 'center', width: '100%', backgroundColor: _defaultBackgroundColor }} >
                <CardContent>
                    <BarLineAreaComposedChart
                        width={_width}
                        height={_height}
                        data={_data}
                        onLabelSelect={_onSelectedLabel}/>
                </CardContent>
            </Card>
        </>
    );
}
function BarLineChartCard(  _width: number,
                        _height: number,
                        _defaultBackgroundColor: string,
                        _startDate: Date,
                        _endDate: Date,
                        _data: IStackedAreaChart[],
                        _tendency: IStackedAreaChart[],
                        _palette: string[]) {
    return (
        <>
            <Card variant="outlined" sx={{ alignItems: 'center', width: '100%', backgroundColor: _defaultBackgroundColor }} >
                <CardContent>
                    <BarLineAreaComposedChart
                        width={_width}
                        height={_height}
                        data={_data}
                        tendencyData={_tendency}/>
                </CardContent>
            </Card>
        </>
    );
}

