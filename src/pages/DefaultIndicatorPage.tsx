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

import { brownBackgroundColor, grayColors, palettes } from '../components/colors';

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
    const [selectedAnalysis, setSelectedAnalysis] = useState<string>(indicator || 'emissao-de-amonia');

    const [labels, setLabels] = useState<Label[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [availableLabels, setAvailableLabels] = useState<[]>([]);

    const [selectedState, setSelectedState] = useState<string>('Nacional');
    const [selectedMapState, setSelectedMapState] = useState<iEstado>(mapStates['Nacional']);

    const [selectedStartPeriod, setSelectedStartPeriod] = useState<Date>(new Date(2000, 0, 1)); // Janeiro é o mês 0
    const [selectedEndPeriod, setSelectedEndPeriod] = useState<Date>(new Date(2024, 11, 31)); // Dezembro é o mês 11

    const [selectedInterval, setSelectedInterval] = useState<string>('annual');
    const [annualSumData, setAnnualSumData] = useState<IStackedAreaChart[]>([]);
    const [selectedSumData, setSelectedSumData] = useState<IStackedAreaChart[]>([]);
    const [selectedPeriodData, setSelectedPeriodData] = useState<IStackedAreaChart[]>([]);
    const [selectedLabelData, setSelectedLabelData] = useState<IStackedAreaChart[]>([]);
    const [selectedSmaData, setSelectedSmaData] = useState<IStackedAreaChart[]>([]);
    const [selectedPercentualData, setSelectedPercentualData] = useState<IPercentualAreaChart[]>([]);

    const [selectedWidth, setSelectedWidth] = useState(Constants.initialConfig.width);
    const [selectedHeight, setSelectedHeight] = useState(Constants.initialConfig.height);

    const [selectedZoom, setSelectedZoom] = useState(selectedMapState.zoom);
    const [selectedBbox, setSelectedBbox] = useState<string>(Constants.initialConfig.bbox);
    const [selectedCenter, setSelectedCenter] = useState<string>();

    const [selectedPalette, setSelectedPalette] = useState<string[]>([]);

    // Inicializar o palette com o verde claro, médio ou escuro
    const [selectedChartDefaultPalette, setSelectedChartDefaultPalette] = useState<string[]>(
        palettes.find((palette) => palette.value === 'discrepantMedium')?.colors.map((color) => color.color) || [],
    );
    const [selectedChartDefaultBackgroundColor, setSelectedChartDefaultBackgroundColor] = useState<string>(brownBackgroundColor);

    function getPaletteColorsByColor(hexColor: string): string[] | null {
        // Percorre cada paleta em palettes
        for (const palette of palettes) {
            // Verifica se o hexColor está em alguma cor da paleta
            const foundColor = palette.colors.find(color => color.color.toLowerCase() === hexColor.toLowerCase());

            // Retorna apenas o array de cores se encontrar a cor
            if (foundColor) {
                return palette.colors.map(color => color.color);
            }
        }
        // Retorna null caso a cor não seja encontrada em nenhuma paleta
        return null;
    }

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

    function handlePeriodChange(newPeriod: string): void {
        setSelectedYear(newPeriod ?? '');
    }

    function handleColorChange(newColor: string): void {
        if (newColor) {
            setSelectedColor(newColor);
            const paletteFound = getPaletteColorsByColor(newColor);
            if (paletteFound) {
                setSelectedPalette(paletteFound);
            }
        }

    }

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
        const state = selectedState == 'Nacional' ? undefined : selectedState;
        if (selectedStartPeriod && selectedEndPeriod){
            buildUrl('sum', selectedStartPeriod, selectedEndPeriod, selectedAnalysis, selectedInterval, '', state).then((sumUrl) => {
                requestStackedData(sumUrl).then((stackedObjects) => {
                    console.log(`[DefaultIndicatorPage] useEffect url: ${sumUrl}`);
                    console.log(`[DefaultIndicatorPage] useEffect sum result: ${stackedObjects.length}`);
                    console.log(`[DefaultIndicatorPage] useEffect sum sample: ${JSON.stringify(stackedObjects?.slice(0, 2), null, 2)}`);
                    setSelectedSumData(stackedObjects);
                });
            });
        }
    }, [selectedStartPeriod, selectedEndPeriod, selectedAnalysis, selectedInterval, selectedState]);

    useEffect(() => {
        const state = selectedState == 'Nacional' ? undefined : selectedState;
        if (selectedYear) {
            const startOfYear = new Date(Number(selectedYear), 0, 1);
            const endOfYear = new Date(Number(selectedYear), 11, 1);
            buildUrl('sum', startOfYear, endOfYear, selectedAnalysis, selectedInterval, '', state).then((sumUrl) => {
                requestStackedData(sumUrl).then((stackedObjects) => {
                    console.log(`[DefaultIndicatorPage] useEffect url: ${sumUrl}`);
                    console.log(`[DefaultIndicatorPage] useEffect sum result: ${stackedObjects.length}`);
                    console.log(`[DefaultIndicatorPage] useEffect sum sample: ${JSON.stringify(stackedObjects?.slice(0, 2), null, 2)}`);
                    setSelectedPeriodData(stackedObjects);
                });
            });
        }
        // Quando mudar apenas o ano/estado, atualizar os dados de período
    } , [selectedYear, selectedState]);

    useEffect(() => {
        const state = selectedState == 'Nacional' ? undefined : selectedState;
        if (selectedLabel && selectedYear) {
            const startOfYear = new Date(Number(selectedYear), 0, 1);
            const endOfYear = new Date(Number(selectedYear), 11, 1);
            buildUrl('sum', selectedStartPeriod, selectedEndPeriod, selectedAnalysis, selectedInterval, selectedLabel, state).then((sumUrl) => {
                requestStackedData(sumUrl).then((stackedObjects) => {
                    console.log(`[DefaultIndicatorPage] useEffect url: ${sumUrl}`);
                    console.log(`[DefaultIndicatorPage] useEffect sum result: ${stackedObjects.length}`);
                    console.log(`[DefaultIndicatorPage] useEffect sum sample: ${JSON.stringify(stackedObjects?.slice(0, 2), null, 2)}`);
                    setSelectedLabelData(stackedObjects);
                });
            });
        }
        // Quando mudar apenas o ano/rótulo/estado, atualizar os dados de rótulo
    } , [selectedYear, selectedLabel, selectedState]);

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
                    {MapBox(selectedMapState,
                            selectedWidth,
                            selectedHeight,
                            (zoom: number) => setSelectedZoom(zoom),
                            (bbox: Array<number>) => setSelectedBbox(bbox.join(', ')),
                            (center: Array<number>) => setSelectedCenter(center.join(', ')) )}
                </Box>
                <Box sx={{ display: 'flex', '& > :not(style)': { m: 1 } }}>

                    {BarChartCard(
                                730, 250,
                                true,
                                false,
                                'horizontal',
                                selectedChartDefaultBackgroundColor,
                                selectedStartPeriod,
                                selectedEndPeriod,
                                selectedSumData,
                                selectedChartDefaultPalette,
                                handleLabelChange,
                                handlePeriodChange,
                                handleColorChange)}
                </Box>
                <Box sx={{ display: 'flex', '& > :not(style)': { m: 1 } }}>
                    {selectedPeriodData && selectedPeriodData.length > 0 && (BarChartCard(
                                150, 200,
                                false,
                                true,
                                'horizontal',
                                selectedChartDefaultBackgroundColor,
                                selectedStartPeriod,
                                selectedEndPeriod,
                                selectedPeriodData,
                                (selectedPalette && selectedPalette.length > 0 ? selectedPalette : grayColors.medium.map(color => color.color)),
                                handleLabelChange,
                                handlePeriodChange))}
                </Box>
                <Box sx={{ display: 'flex', '& > :not(style)': { m: 1 } }}>
                    {selectedLabelData && selectedLabelData.length > 0 && (BarChartCard(
                                150, 200,
                                false,
                                false,
                                'horizontal',
                                selectedChartDefaultBackgroundColor,
                                selectedStartPeriod,
                                selectedEndPeriod,
                                selectedLabelData,
                                [selectedColor],
                                handleLabelChange,
                                handlePeriodChange))}
                </Box>
            </Paper>

            </div>
        </AnalysisProvider>
    );
};

export default DefaultIndicatorPage;

function BarChartCard(  _width: number,
                        _height: number,
                        _stacked: boolean,
                        _legend: boolean,
                        _layout: 'horizontal' | 'vertical',
                        _defaultBackgroundColor: string,
                        _startDate: Date,
                        _endDate: Date,
                        _data: IStackedAreaChart[],
                        _palette: string[],
                        _onSelectedLabel: (newLabel: string) => void,
                        _onSelectedPeriod: (newLabel: string) => void,
                        _onSelectedColor?: (newColor: string) => void,
                    ) {
    return (
        <>
            <Card variant="outlined" sx={{ alignItems: 'center', width: '100%', backgroundColor: _defaultBackgroundColor }} >
                <CardContent>
                    <BarLineAreaComposedChart
                        stacked={_stacked}
                        legend={_legend}
                        layout={_layout}
                        width={_width}
                        height={_height}
                        data={_data}
                        onLabelSelect={_onSelectedLabel}
                        onPeriodSelect={_onSelectedPeriod}
                        oncolorSelect={_onSelectedColor}
                        defaultPalette={_palette}/>
                </CardContent>
            </Card>
        </>
    );
}

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
    url="http://localhost:8080/geoserver/isagro/wms"
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
    layers = 'isagro:balanco-de-k'
    format="image/jpeg"
    transparent={false}
    styles=''
    bgcolor="0xFFFFFF" />
</Box>
);
}
