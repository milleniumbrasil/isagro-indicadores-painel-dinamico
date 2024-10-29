// src/components/ParamsBar.tsx

import { FC } from 'react';

import {
    Box,
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from '@mui/material';

import { estados as mapStates } from 'isagro-map';

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
                <Typography variant="h6" sx={{ padding: '10px' }}>Início</Typography>
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
                </FormControl>
            </Box>
            <Box sx={{ minWidth: '200px' }}>
                <Typography variant="h6" sx={{ padding: '10px' }}>Fim</Typography>
                <FormControl fullWidth sx={{ display: 'flex', gap: '10px', flexDirection: 'row', alignItems: 'center' }}>
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
                        <MenuItem id="00-interval-item" value="annual">Anual</MenuItem>
                        <MenuItem id="01-interval-item" value="biennial">Bienal</MenuItem>
                        <MenuItem id="02-interval-item" value="triennial">Trienal</MenuItem>
                        <MenuItem id="03-interval-item" value="quadrennial">Quadrienal</MenuItem>
                        <MenuItem id="04-interval-item" value="quinquennial">Quinquenal</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Estado */}
            <Box sx={{ minWidth: '200px' }}>
                <Typography variant="h6" sx={{ padding: '10px' }}>Estado</Typography>
                <FormControl fullWidth>
                    <Select id="state-select" value={_state} onChange={_handleStateChange}>
                        <MenuItem id="0-menu-item-estado" value="">
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
        </Box>
    );
}

export default ParamsBar;
