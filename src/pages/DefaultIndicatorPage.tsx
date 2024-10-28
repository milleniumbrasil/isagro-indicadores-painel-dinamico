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
    const [selectedAnalysis, setSelectedAnalysis] = useState<string>(indicator || 'NH3');

    const [labels, setLabels] = useState<Label[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<string>('');
    const [availableLabels, setAvailableLabels] = useState<[]>([]);

    const [selectedState, setSelectedState] = useState<string>('Distrito Federal');
    const [selectedMapState, setSelectedMapState] = useState<iEstado>(mapStates['Distrito Federal']);

    const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date(2000, 0, 1)); // Janeiro é o mês 0
    const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date('2024-12-31'));

    const [selectedInterval, setSelectedInterval] = useState<string>('annual');
    const [annualSumData, setAnnualSumData] = useState<IStackedAreaChart[]>([]);
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
    }, [selectedStartDate, selectedEndDate, selectedAnalysis, selectedInterval]);

    useEffect(() => {
        if (indicator) setSelectedAnalysis(indicator);
    }, [indicator]);

    useEffect(() => {
        if (selectedStartDate && selectedEndDate) {
            buildUrl('volume', selectedStartDate, selectedEndDate, selectedAnalysis, 'annual').then((sumUrl) => {
                requestStackedData(sumUrl).then((stackedObjects) => {
                    console.log(`[AnalysisPage] useEffect url: ${sumUrl}`);
                    console.log(`[AnalysisPage] useEffect volume result: ${stackedObjects.length}`);
                    console.log(`[AnalysisPage] useEffect volume sample: ${JSON.stringify(stackedObjects?.slice(0, 2), null, 2)}`);
                    setAnnualSumData(stackedObjects);
                });
            });
        }
    }, [selectedStartDate, selectedEndDate]);

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

    const toggleDrawer = (newOpen: boolean) => () => {
        setDrawerOpen(newOpen);
    };

    return (
        <AnalysisProvider>
            <div>

            <ParamsBar
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
                                selectedStartDate,
                                selectedEndDate,
                                selectedSumData,
                                selectedChartDefaultPalette)
                                }
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
                        _palette: string[]) {
    return (
        <>
            <Card variant="outlined" sx={{ alignItems: 'center', width: '100%', backgroundColor: _defaultBackgroundColor }} >
                <CardContent>
                    <BarLineAreaComposedChart
                        width={_width}
                        height={_height}
                        data={_data}/>
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

