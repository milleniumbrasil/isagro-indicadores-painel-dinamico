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
import { iEstado, estados as mapStates, Map } from 'isagro-map';

import { buildUrl } from '../pages/AnalysisHelper';

import {
    greenBackgroundColor,
    brownBackgroundColor,
    redBackgroundColor,
    grayBackgroundColor,
    blueBackgroundColor,
    blueColors,
    yellowBackgroundColor,
    palettes,
    backgroundColors,
    brownColors,
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
import Constants, { analysisDescriptions, getValidLabelsByAnalysis, Label } from './AnalysisConstants';
import { useAnalysisContext } from '../components/AnalysisContext';
import { IAnalysisInfo } from './IAnalysisInfo';
import { findAnalysisDescription } from './AnalysisHelper';
import StackedAreaChart from '../components/charts/StackedAreaChart';

export function Loading() {
    return (
        <div>
            <Loader backdrop content="loading..." vertical />
        </div>
    );
}

const AnalysisPage: FC = () => {

    const [selectedSource, setSelectedSource] = useState<string>('');
    const [selectedAnalysis, setSelectedAnalysis] = useState<string>('orgânicas');
    const [labels, setLabels] = useState<Label[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<string>('');
    const [selectedState, setSelectedState] = useState<string>('Distrito Federal');
    const [selectedMapState, setSelectedMapState] = useState<iEstado>(mapStates['Distrito Federal']);
    const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date('1990-01-01'));
    const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date('1995-12-31'));
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
        palettes.find(palette => palette.value === 'greenDark')?.colors.map(color => color.color) || []
    );
    const [selectedChartDefaultBackgroundColor, setSelectedChartDefaultBackgroundColor] = useState<string>(brownBackgroundColor);

    const handlePaletteChange = (event: SelectChangeEvent) => {
        const selectedPaletteValue = event.target.value as string;
        setSelectedPalette(selectedPaletteValue);

        // Extrair apenas as cores da paleta selecionada
        const colors = palettes.find(palette => palette.value === selectedPaletteValue)?.colors.map(color => color.color);
        if (colors) {
            setSelectedChartDefaultPalette(colors);
        }
    };

    const handleBackgroundColors = (event: SelectChangeEvent) => {
        const selectedBgColorValue = event.target.value as string;
        setSelectedBackgroundColor(selectedBgColorValue);

        // Encontrar a cor de fundo com base na seleção do usuário
        const bgColor = backgroundColors.find(bgColor => bgColor.value === selectedBgColorValue)?.bg;
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

        // Busca os rótulos válidos com base na análise e mapeia-os para a exibição correta
        const validLabelValues: string[] = getValidLabelsByAnalysis(selectedValue);
        const validLabelsForDisplay = Constants.availableLabels.filter((labelItem: Label) => validLabelValues.includes(labelItem.value));
        setLabels(validLabelsForDisplay);
        console.log('[AnalysisPage] Análise selecionada:', selectedValue);
    };

    const handleLabelChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value as string;
        setSelectedLabel(selectedValue); // Atualiza o estado do rótulo selecionado
        console.log('[AnalysisPage] Rótulo selecionado:', selectedValue);
    };

    const requestStackedData = async (
        url: string
    ): Promise<IStackedAreaChart[]> => {
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

    useEffect(() => {

        buildUrl('sma', selectedStartDate, selectedEndDate, selectedAnalysis, selectedInterval).then((smaUrl) => {
            requestStackedData(smaUrl).then(
                (stackedObjects) => {
                    console.log(`[AnalysisPage] useEffect url: ${smaUrl}`);
                    console.log(`[AnalysisPage] useEffect sma result: ${stackedObjects.length}`);
                    console.log(`[AnalysisPage] useEffect sma sample: ${JSON.stringify(stackedObjects?.slice(0, 2), null, 2)}`);
                    setSelectedSmaData(stackedObjects);
                },
            );
        });

        buildUrl('sum', selectedStartDate, selectedEndDate, selectedAnalysis, selectedInterval).then((sumUrl) => {
            requestStackedData(sumUrl).then(
                (stackedObjects) => {
                    console.log(`[AnalysisPage] useEffect url: ${sumUrl}`);
                    console.log(`[AnalysisPage] useEffect sum result: ${stackedObjects.length}`);
                    console.log(`[AnalysisPage] useEffect sum sample: ${JSON.stringify(stackedObjects?.slice(0, 2), null, 2)}`);
                    setSelectedSumData(stackedObjects);
                },
            );
        });

        buildUrl('percentage', selectedStartDate, selectedEndDate, selectedAnalysis, selectedInterval).then((percentageUrl) => {
            requestStackedData(percentageUrl).then(
                (stackedObjects) => {
                    console.log(`[AnalysisPage] useEffect url: ${percentageUrl}`);
                    console.log(`[AnalysisPage] useEffect percentage result: ${stackedObjects.length}`);
                    console.log(`[AnalysisPage] useEffect percentage sample: ${JSON.stringify(stackedObjects?.slice(0, 2), null, 2)}`);
                    // Transformando de IStackedAreaChart para IPercentualAreaChart
                    const percentualObjects: IPercentualAreaChart[] = stackedObjects.map((item) => ({
                        period: item.period,
                        value: parseFloat(item.entry[1].toString()), // Pega diretamente o valor de entry[1] como percentual
                    }));
                    setSelectedPercentualData(percentualObjects);
                },
            );
        });

        const analysisInfos = analysisDescriptions(selectedStartDate, selectedEndDate);
        const initialAnalysisDescription = findAnalysisDescription(selectedAnalysis, selectedStartDate, selectedEndDate, analysisInfos);
        setCurrentAnalysisDescription(initialAnalysisDescription);

    }, [selectedAnalysis, selectedLabel, selectedStartDate, selectedEndDate, selectedState, selectedSource, selectedInterval]);

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
                        <Box sx={{ display: 'flex', '& > :not(style)': { m: 1 } }}>
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
                                        <Typography>Estado selecionado {selectedState}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>Ao selecionar um estado, o mapa deve exibir a imagem correspondente.</Typography>
                                        <Divider variant="middle" sx={{ margin: '15px' }} />
                                        <FormControl fullWidth>
                                            <Select id="state-select" value={selectedState} onChange={handleStateChange}>
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
                                        <Typography>Análise selecionada {selectedAnalysis}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>Ao selecionar uma análise, os gráficos devem exibir os dados correspondentes.</Typography>
                                        <Divider variant="middle" sx={{ margin: '15px' }} />
                                        <FormControl fullWidth>
                                            <Select id="analysis-select" value={selectedAnalysis} onChange={handleAnalysisChange}>
                                                {Constants.availableAnalysis.map((analysis: Label) => (
                                                    <MenuItem
                                                        id={`${analysis.value}-menu-item-analysis`}
                                                        value={analysis.value}
                                                        key={analysis.value}
                                                    >
                                                        {analysis.label}
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
                                                {Constants.availableSources.map((source: Label) => (
                                                    <MenuItem id={`${source.value}-menu-item-source`} value={source.value} key={source.value}>
                                                        {source.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="interval-content" id="interval-header">
                                        <Typography>Intervalo selecionado {selectedInterval}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>Selecione o intervalo para a análise (anual, bienal, etc.).</Typography>
                                        <Divider variant="middle" sx={{ margin: '15px' }} />
                                        <FormControl fullWidth>
                                            <Select id="interval-select" value={selectedInterval} onChange={handleIntervalChange}>
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
                                        <Typography>
                                            Paleta Selecionada: {palettes.find(palette => palette.value === selectedPalette)?.label}, cor de fundo: {backgroundColors.find(bgColor => bgColor.value === selectedBackgroundColor)?.label}
                                            </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Divider variant="middle" sx={{ margin: '15px' }} />
                                        <Typography>Ao selecionar uma paleta, os gráficos devem exibir as cores correspondentes.</Typography>
                                        <FormControl fullWidth>
                                            <Select
                                                id="palettes-select"
                                                value={selectedPalette}
                                                onChange={handlePaletteChange} >
                                                <MenuItem value="">
                                                <em>Não informado</em>
                                                </MenuItem>
                                                {palettes.map((palette) => (
                                                <MenuItem
                                                    id={`${palette.value}-menu-item-palette`}
                                                    value={palette.value}
                                                    key={palette.value} >
                                                    {palette.label}
                                                </MenuItem>
                                                ))}
                                            </Select>
                                            <Divider variant="middle" sx={{ margin: '15px' }} />
                                            <Typography>Ao selecionar uma cor de fundo, os gráficos devem exibir a core correspondente.</Typography>
                                            <Select
                                                id="palettes-select"
                                                value={selectedBackgroundColor}
                                                onChange={handleBackgroundColors} >
                                                <MenuItem value="">
                                                <em>Não informado</em>
                                                </MenuItem>
                                                {backgroundColors.map((bgColors) => (
                                                <MenuItem
                                                    id={`${bgColors.value}-menu-item-palette`}
                                                    value={bgColors.value}
                                                    key={bgColors.value} >
                                                    {bgColors.label}
                                                </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </AccordionDetails>
                                    </Accordion>
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>

                <Box sx={{ display: 'flex', '& > :not(style)': { m: 1 } }}>

                    <Box sx={{ flexGrow: 1, margin: '30px', padding: '30px', border: 5, borderColor: grayBackgroundColor }}>
                        <Map
                            estado={selectedMapState}
                            width={selectedWidth}
                            height={selectedHeight}
                            coordinateOnClick={(coordinate: Array<number>) => alert(`Coordenada do clique: ${coordinate}`)}
                            onZoomChange={(zoom: number) => setSelectedZoom(zoom)}
                            onBboxChange={(b: Array<number>) => setSelectedBbox(b.join(', '))}
                            onCenterChange={(c: Array<number>) => setSelectedCenter(c.join(', '))}
                            version="1.3.0"
                            request="GetMap"
                            srs="EPSG:4326"
                            layers="CCAR:BCIM_Unidade_Federacao_A"
                            format="image/jpeg"
                            transparent={false}
                            bgcolor="0xFFFFFF"
                        />
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
                        sx={{ alignItems: 'center', width: '98%', backgroundColor: selectedChartDefaultBackgroundColor, margin: '10px' }}
                    >
                        <CardContent>
                            <Typography variant="h6" sx={{ padding: '15px' }}>
                                {currentAnalysisDescription?.title} por período{' '}
                                {`${selectedStartDate.getFullYear()} à ${selectedEndDate.getFullYear()}`}
                            </Typography>
                            <Typography variant="body2" sx={{ padding: '10px' }}>
                                {currentAnalysisDescription?.description}
                            </Typography>

                            <StackedAreaChart width={400} height={250} data={selectedSumData} defaultPalette={selectedChartDefaultPalette} />
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
                        sx={{ alignItems: 'center', width: '98%', backgroundColor: selectedChartDefaultBackgroundColor, margin: '10px' }}
                    >
                        <CardContent>
                            <Typography variant="h6" sx={{ padding: '15px' }}>
                                {currentAnalysisDescription?.title} por período{' '}
                                {`${selectedStartDate.getFullYear()} à ${selectedEndDate.getFullYear()}`}
                            </Typography>
                            <Typography variant="body2" sx={{ padding: '10px' }}>
                                {currentAnalysisDescription?.description}
                            </Typography>

                            <StackedAreaChart width={400} height={250} data={selectedSmaData} defaultPalette={selectedChartDefaultPalette} />
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
                        sx={{ alignItems: 'center', width: '98%', backgroundColor: selectedChartDefaultBackgroundColor, margin: '10px' }}
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
                                data={selectedPercentualData}
                                valueLabel="Área"
                                fillColor={brownColors.medium.find(color => color.value === 'sandyBrown')?.color || '#F4A460'} // Usar o valor correto da cor
                                strokeColor={brownColors.medium.find(color => color.value === 'chocolate')?.color || '#D2691E'} // Usar o valor correto da cor
                            />
                        </CardContent>
                    </Card>
                </Paper>
            </div>
        </AnalysisProvider>
    );
};

export default AnalysisPage;
