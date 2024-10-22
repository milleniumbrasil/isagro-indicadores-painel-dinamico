import { FC, SyntheticEvent } from 'react';

import {
    Box,
    SwipeableDrawer,
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScienceIcon from '@mui/icons-material/Science';
import PaletteIcon from '@mui/icons-material/Palette';
import DateRangeIcon from '@mui/icons-material/DateRange';
import MapIcon from '@mui/icons-material/Map';
import LabelIcon from '@mui/icons-material/Label';

import { estados as mapStates } from 'isagro-map';
import { palettes, backgroundColors } from '../components/colors';

interface ParamsSwipeableDrawerProps {
    _drawerOpen: boolean;
    _startDate: Date;
    _endDate: Date;
    _state: string;
    _indicator: string;
    _availableIndicators: string[];
    _label: string;
    _availableLabels: string[];
    _source: string;
    _availableSources: string[];
    _interval: string;
    _backgroundColor: string;
    _palette: string;
    _toggleDrawer: (newOpen: boolean) => () => void;
    _handleStateChange: (event: SelectChangeEvent) => void;
    _handleAnalysisChange: (event: SelectChangeEvent<string>) => void;
    _handleLabelChange: (event: SelectChangeEvent<string>) => void;
    _handleStartDateChange: (event: SelectChangeEvent<string>) => void;
    _handleEndDateChange: (event: SelectChangeEvent<string>) => void;
    _handleSourceChange: (event: SelectChangeEvent) => void;
    _handleIntervalChange: (event: SelectChangeEvent) => void;
    _handleBackgroundColors: (event: SelectChangeEvent) => void;
    _handlePaletteChange: (event: SelectChangeEvent) => void;
}

const ParamsSwipeableDrawer: FC<ParamsSwipeableDrawerProps> = ({
    _drawerOpen,
    _startDate,
    _endDate,
    _state,
    _indicator,
    _availableIndicators,
    _label,
    _availableLabels,
    _source,
    _availableSources,
    _interval,
    _backgroundColor,
    _palette,
    _toggleDrawer,
    // _handleChangeRangeDates,
    _handleStateChange,
    _handleAnalysisChange,
    _handleLabelChange,
    _handleStartDateChange,
    _handleEndDateChange,
    _handleSourceChange,
    _handleIntervalChange,
    _handleBackgroundColors,
    _handlePaletteChange,
}) => {

    const currentYear = new Date().getFullYear();

    const generateYearOptions = (startYear: number, endYear: number): string[] => {
        const years: string[] = [];
        for (let year = startYear; year <= endYear; year++) {
            years.push(year.toString());
        }
        return years;
    };

    return (
        <SwipeableDrawer anchor={'right'} open={_drawerOpen} onClose={_toggleDrawer(false)} onOpen={_toggleDrawer(true)}>
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
                                <ListItemText primary="Período" secondary={`${_startDate.getFullYear()} até ${_endDate.getFullYear()}`} />
                            </ListItem>
                        </List>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>Ao selecionar um período, os gráficos devem exibir os dados correspondentes.</Typography>
                        <Divider variant="middle" sx={{ margin: '15px' }} />
                        <FormControl fullWidth sx={{ display: 'flex', gap: '10px', flexDirection: 'row', alignItems: 'center', marginTop: '20px' }}>
                            <Select
                                id="period-start-select"
                                value={_startDate.getFullYear().toString()} 
                                onChange={_handleStartDateChange}
                                sx={{ flex: 1 }}
                            >
                                {generateYearOptions(2000, new Date().getFullYear()).map((startYear: string, index: number) => (
                                    <MenuItem id={`${index}-menu-item-period-start`} value={startYear} key={index}>
                                        {startYear}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Select
                                id="period-end-select"
                                value={_endDate.getFullYear().toString()}
                                onChange={_handleEndDateChange}
                                sx={{ flex: 1 }}
                            >
                                {generateYearOptions(2000, new Date().getFullYear()).map((endYear: string, index: number) => (
                                    <MenuItem id={`${index}-menu-item-period-end`} value={endYear} key={index}>
                                        {endYear}
                                    </MenuItem>
                                ))}
                            </Select>
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
                {/* <Accordion>
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
                        <Typography>Ao selecionar um indicador, os gráficos devem exibir os dados correspondentes.</Typography>
                        <Divider variant="middle" sx={{ margin: '15px' }} />
                        <FormControl fullWidth>
                            <Select id="analysis-select" value={_indicator} onChange={_handleAnalysisChange}>
                                {_availableIndicators?.map((analysis: string) => (
                                    <MenuItem id={`${analysis}-menu-item-analysis`} value={analysis} key={analysis}>
                                        {analysis}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </AccordionDetails>
                </Accordion> */}
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
                                    secondary={backgroundColors.find((bgColor) => bgColor.value === _backgroundColor)?.label}
                                />
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
                                    <MenuItem id={`${bgColors.value}-menu-item-palette`} value={bgColors.value} key={bgColors.value}>
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
                                <ListItemText primary="Paleta" secondary={palettes.find((palette) => palette.value === _palette)?.label} />
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

export default ParamsSwipeableDrawer;
