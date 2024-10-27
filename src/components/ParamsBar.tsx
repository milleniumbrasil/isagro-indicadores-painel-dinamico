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
import { palettes, backgroundColors } from './colors';

interface ParamsBarProps {
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

const ParamsBar: FC<ParamsBarProps> = ({
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
        <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', margin: '20px' }}>
            {/* Período */}
            <Box sx={{ minWidth: '200px' }}>
                <Typography variant="h6" sx={{ padding: '10px' }}>Período</Typography>
                <FormControl fullWidth sx={{ display: 'flex', gap: '10px', flexDirection: 'row', alignItems: 'center' }}>
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
            </Box>

            {/* Intervalo */}
            <Box sx={{ minWidth: '200px' }}>
                <Typography variant="h6" sx={{ padding: '10px' }}>Intervalo</Typography>
                <FormControl fullWidth>
                    <Select id="interval-select" value={_interval} onChange={_handleIntervalChange}>
                        <MenuItem value="annual">Anual</MenuItem>
                        <MenuItem value="biennial">Bienal</MenuItem>
                        <MenuItem value="triennial">Trienal</MenuItem>
                        <MenuItem value="quadrennial">Quadrienal</MenuItem>
                        <MenuItem value="quinquennial">Quinquenal</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Estado */}
            <Box sx={{ minWidth: '200px' }}>
                <Typography variant="h6" sx={{ padding: '10px' }}>Estado</Typography>
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
            </Box>

            {/* Rótulo */}
            {/* <Box sx={{ minWidth: '200px' }}>
                <Typography variant="h6" sx={{ padding: '10px' }}>Rótulo</Typography>
                <FormControl fullWidth>
                    <Select id="label-select" value={_label} onChange={_handleLabelChange}>
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
            </Box> */}

            {/* Fonte */}
            {/* <Box sx={{ minWidth: '200px' }}>
                <Typography variant="h6" sx={{ padding: '10px' }}>Fonte</Typography>
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
            </Box> */}
        </Box>
    );
}

export default ParamsBar;
