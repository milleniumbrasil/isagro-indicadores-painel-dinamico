// src/pages/AnalysisPage.tsx

import './AnalysisPage.css';
import 'rsuite/SelectPicker/styles/index.css';
import 'rsuite/DateRangePicker/styles/index.css';
import 'rsuite/dist/rsuite.min.css';

import { FC, useEffect, useState, Suspense, SyntheticEvent } from 'react';

import Drawer from '@mui/material/Drawer';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import {
    Box,
    Fab,
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from '@mui/material';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import { iEstado, estados, Map } from 'isagro-map';

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

export function Loading() {
    return (
        <div>
            <Loader backdrop content="loading..." vertical />
        </div>
    );
}

const AnalysisPage: FC = () => {
    // dados do servidor armazenados no contexto
    // const { states: contextStates } = useAnalysisContext();
    // const { countries: contextCountries } = useAnalysisContext();
    // const { cities: contextCities } = useAnalysisContext();
    // const { organicasStackedData: contextAnalysisStackedData } = useAnalysisContext();
    // const { organicasPercentual: contextAnalysisPercentual } = useAnalysisContext();

    // const [internalAnalysisStacked, setInternalAnalysisStacked] = useState<IStackedAreaChart[]>([]);
    // const [internalAnalysisPercentual, setInternalAnalysisPercentual] = useState<IPercentualAreaChart[]>([]);

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

    const [selectedSource, setSelectedSource] = useState<string>('UNB');
    const [selectedAnalysis, setSelectedAnalysis] = useState<string>('orgânicas');
    const [labels, setLabels] = useState<Label[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<string>('fruticultura');
    const [selectedStateName, setSelectedStateName] = useState<string>('Distrito Federal');
    const [selectedState, setSelectedState] = useState<iEstado>(estados['Distrito Federal']);
    const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date());
    const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date());

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

    const handleConfigChange = (newConfig: TileLayerConfig) => {
        console.log('Updating config in DashboardPage:', newConfig);

        if (newConfig.zoom !== zoom) {
            setZoom(newConfig.zoom || initialConfig.zoom);
            console.log('Zoom state updated:', newConfig.zoom || initialConfig.zoom);
        }

        if (newConfig.bbox !== bbox) {
            setBbox(newConfig.bbox || initialConfig.bbox);
            console.log('BBox state updated:', newConfig.bbox || initialConfig.bbox);
        }

        if (newConfig.layers !== layers) {
            setLayers(newConfig.layers || initialConfig.layers);
        }
        if (newConfig.styles !== styles) {
            setStyles(newConfig.styles || initialConfig.styles);
        }
        if (newConfig.format !== format) {
            setFormat(newConfig.format || initialConfig.format);
        }
        if (newConfig.transparent !== transparent) {
            setTransparent(newConfig.transparent || initialConfig.transparent);
        }
        if (newConfig.version !== version) {
            setVersion(newConfig.version || initialConfig.version);
        }
        if (newConfig.crs !== crs) {
            setCrs(newConfig.crs || initialConfig.crs);
        }
        if (newConfig.uppercase !== uppercase) {
            setUppercase(newConfig.uppercase || initialConfig.uppercase);
        }
        if (newConfig.url !== url) {
            setUrl(newConfig.url || initialConfig.url);
        }
        if (newConfig.exceptions !== exceptions) {
            setExceptions(newConfig.exceptions || initialConfig.exceptions);
        }
        if (newConfig.bgcolor !== bgcolor) {
            setBgcolor(newConfig.bgcolor || initialConfig.bgcolor);
        }
        if (newConfig.width !== width) {
            setWidth(newConfig.width || initialConfig.width);
        }
        if (newConfig.height !== height) {
            setHeight(newConfig.height || initialConfig.height);
        }
    };

    const tileLayerConfig: TileLayerConfig = {
        layers,
        styles,
        format,
        transparent,
        version,
        crs,
        uppercase,
        url,
        exceptions,
        bgcolor,
        width,
        height,
        bbox,
        zoom,
        customParams: {},
    };

    useEffect(() => {
        console.log('Zoom state updated:', zoom);
    }, [zoom]);

    useEffect(() => {
        console.log('BBox state updated:', bbox);
    }, [bbox]);

    const handleStateChange = (event: SelectChangeEvent) => {
        const stateName = event.target.value as string;
        setSelectedStateName(stateName);
        const state = estados[stateName];
        setSelectedState(state);
        setBbox(state.bbox.join(','));
        setZoom(state.zoom);
    };

    const handleChangeRangeDates = (rangeDates: DateRange | null, event: SyntheticEvent<Element, Event>) => {
        // preciso atribuir os valores de data para as variaveis startDate e endDate
        if (rangeDates) {
            rangeDates.map((date, index) => {
                if (index === 0) {
                    setSelectedStartDate(date);
                } else {
                    setSelectedEndDate(date);
                }
            });
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

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             if (contextAnalysisPercentual && contextAnalysisPercentual.length > 0) {
    //                 setInternalAnalysisPercentual(contextAnalysisPercentual);
    //                 console.log(`[Page] internalAnalysisPercentual loaded from context: ${contextAnalysisPercentual.length}`);
    //             } else {
    //                 throw new Error('Page: contextAnalysisPercentual is required');
    //             }

    //             if (contextAnalysisStackedData && contextAnalysisStackedData.length > 0) {
    //                 setInternalAnalysisStacked(contextAnalysisStackedData);
    //                 console.log(`[Page] internalAnalysisStacked loaded from context: ${internalAnalysisStacked.length}`);
    //             } else {
    //                 throw new Error('Page: contextAnalysisStackedData is required');
    //             }
    //         } catch (error) {
    //             console.error(error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, [contextAnalysisPercentual, contextAnalysisStackedData]);

    useEffect(() => {
        // Atualiza os rótulos com base na análise padrão (orgânicas)
        const validLabelValues = getValidLabelsByAnalysis(selectedAnalysis);
        const validLabelsForDisplay = availableLabels.filter((labelItem) => validLabelValues.includes(labelItem.value));

        // Apenas atualize os rótulos se forem diferentes dos atuais
        if (JSON.stringify(labels) !== JSON.stringify(validLabelsForDisplay)) {
            setLabels(validLabelsForDisplay);
        }

        // Verifica se o rótulo padrão existe na lista de rótulos válidos
        if (!validLabelValues.includes(selectedLabel)) {
            setSelectedLabel(validLabelsForDisplay.length > 0 ? validLabelsForDisplay[0].value : '');
        }

        // Inicializa a fonte com 'UNB' se disponível, senão escolhe a primeira fonte disponível
        if (!availableSsources.map(source => source.value).includes(selectedSource)) {
            setSelectedSource(availableSsources.length > 0 ? availableSsources[0].value : '');
        }
    }, [selectedAnalysis, availableSsources]); // Removi `availableLabels` da lista de dependências para evitar loop

    return (
        <>
            {/* <Suspense fallback={<Loading />}>
                {internalAnalysisPercentual.length > 0 ? (
                    <PaperAnalysis
                        stackedData={internalAnalysisStacked}
                        percentualData={internalAnalysisPercentual}
                        countries={contextCountries}
                        states={contextStates}
                        cities={contextCities}
                    />
                ) : (
                    <Loading />
                )}
            </Suspense> */}


            <div>
                <Drawer anchor={'right'} open={open} onClose={() => setOpen(false)}>
                    <Box sx={{ width: '600px', padding: '60px' }}>
                        <Box sx={{ margin: '15px' }}>
                            <Fab color="default" size="small" aria-label="reset" onClick={() => reset()} sx={{ margin: '5px' }}>
                                <RestartAltIcon sx={{ margin: '10px' }} />
                            </Fab>
                            <Fab color="error" size="small" aria-label="close" onClick={() => setOpen(false)} sx={{ margin: '5px' }}>
                                <CloseIcon sx={{ margin: '10px' }} />
                            </Fab>
                        </Box>

                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="estado-content" id="estado-header">
                                <Typography>Estado</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>Ao selecionar um estado, o mapa deve exibir a imagem correspondente.</Typography>
                                <Divider variant="middle" sx={{ margin: '15px' }} />
                                <FormControl fullWidth>
                                    <Select id="state-select" value={selectedStateName} onChange={handleStateChange}>
                                        <MenuItem value="">
                                            <em>Selecione um estado</em>
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
                                <Typography>Análise</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>Ao selecionar uma análise, os gráficos devem exibir os dados correspondentes.</Typography>
                                <Divider variant="middle" sx={{ margin: '15px' }} />
                                <FormControl fullWidth>
                                    <Select
                                        id="analysis-select"
                                        value={selectedAnalysis}
                                        onChange={handleAnalysisChange}
                                    >
                                        <MenuItem value="">
                                            <em>Selecione uma análise</em>
                                        </MenuItem>
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
                                <Typography>Rótulo</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>Ao selecionar um rótulo, os gráficos devem exibir os dados correspondentes.</Typography>
                                <Divider variant="middle" sx={{ margin: '15px' }} />
                                <FormControl fullWidth>
                                    <Select id="analysis-select" value={selectedLabel} onChange={handleLabelChange}>
                                        <MenuItem value="">
                                            <em>Selecione um rótulo</em>
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
                                <Typography>Fonte</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>Ao selecionar uma fonte, os gráficos devem exibir os dados correspondentes.</Typography>
                                <Divider variant="middle" sx={{ margin: '15px' }} />
                                <FormControl fullWidth>
                                    <Select
                                        id="source-select"
                                        value={selectedSource}
                                        onChange={handleSourceChange}
                                    >
                                        <MenuItem value="">
                                            <em>Selecione uma fonte</em>
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
                    </Box>
                </Drawer>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<InfoIcon />}
                        aria-controls="summary-content"
                        id="summary-header"
                        sx={{ justifyContent: 'flex-end' }}
                    >
                        <Typography sx={{ ml: 'auto', marginRight: '10px' }}>Sobre o Dashboard de Componentes</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            ...
                        </Typography>
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
                    <Box sx={{ margin: '15px' }}>
                        <Fab color="default" size="small" aria-label="reset" onClick={() => reset()} sx={{ margin: '5px' }}>
                            <RestartAltIcon sx={{ margin: '10px' }} />
                        </Fab>
                        <Fab color="secondary" size="small" aria-label="close" onClick={() => setOpen(true)} sx={{ margin: '5px' }}>
                            <EditIcon sx={{ margin: '10px' }} />
                        </Fab>
                    </Box>
                    <Box sx={{ margin: '10px' }}>

                    <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="period-content" id="period-header">
                                <Typography>Período</Typography>
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
                        <Typography variant="h6" sx={{ padding: '15px' }}>

                        </Typography>
                        <Typography variant="body2" sx={{ padding: '15px', width: '550px' }}>

                        </Typography>

                        <Typography variant="body2">
                        </Typography>
                    </Box>
                </Box>
            </div>
        </>
    );
};

export default AnalysisPage;
