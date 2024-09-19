// src/components/PaperPoluicoes.tsx

import 'rsuite/dist/rsuite.min.css';

import { FC, useState, useEffect, SyntheticEvent, Suspense } from 'react';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { DateRangePicker, Stack as StackRSuite } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';

import { ICountry } from "../charts/ICountry";
import { IState } from "../charts/IState";
import { ICity } from "../charts/ICity";
import { IStackedAreaChart } from '../charts/IStackedAreaChart';
import { IPercentualAreaChart } from '../charts/IPercentualAreaChart';
import { usePoluicoesContext } from './PoluicoesContext';
import PercentualAreaChart from '../charts/PercentualAreaChart';
import { DateRange } from 'rsuite/esm/DateRangePicker';
import AreaChart from '../charts/AreaChart';

import { greenBackgroundColor,
    yellowPalette,
    bluePalette,
    brownPalette,
    brownBackgroundColor,
    redBackgroundColor,
    grayBackgroundColor,
    blueBackgroundColor,
    yellowBackgroundColor
} from '../colors';

import { Box, Typography } from '@mui/material';

interface PaperPoluicoesProps {
    countries: ICountry[];
    states: IState[];
    cities: ICity[];
    percentualData: IPercentualAreaChart[];
    stackedData: IStackedAreaChart[];
}

export function Loading() {
    return (
        <p>
            <i>Loading...</i>
        </p>
    );
}

const PaperPoluicoes: FC<PaperPoluicoesProps> = (props) => {
    // dados do servidor armazenados no contexto
    const { contextCountries } = usePoluicoesContext();
    const { contextStates } = usePoluicoesContext();
    const { contextCities } = usePoluicoesContext();
    const { contextStartDate } = usePoluicoesContext();
    const { contextEndDate } = usePoluicoesContext();
    const { setContextStartDate } = usePoluicoesContext();
    const { setContextEndDate } = usePoluicoesContext();

    // dados internos do componente
    const [internalCountries, setInternalCountries] = useState<ICountry[]>([]);
    const [internalStates, setInternalStates] = useState<IState[]>([]);
    const [internalCities, setInternalCities] = useState<ICity[]>([]);
    const [internalPercentualData, setInternalPercentualData] = useState<IPercentualAreaChart[]>([]);
    const [internalStackedData, setInternalStackedData] = useState<IStackedAreaChart[]>([]);

    // dados selecionados em tela
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    // manipuladores de eventos de tela
    const handleChangeCountry = (event: SelectChangeEvent) => {
        setSelectedCountry(event.target.value as string);
    };

    const handleChangeState = (event: SelectChangeEvent) => {
        setSelectedState(event.target.value as string);
    };

    const handleChangeCity = (event: SelectChangeEvent) => {
        setSelectedCity(event.target.value as string);
    };

    const handleChangeRangeDates = (rangeDates: DateRange | null, event: SyntheticEvent<Element, Event>) => {
        if (rangeDates) {
            const [startDate, endDate] = rangeDates;
            setContextStartDate(startDate);
            setContextEndDate(endDate);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!props.percentualData || props.percentualData.length === 0)
                    throw new Error('[PaperPoluicoes]: percentualData is required');
                setInternalPercentualData(props.percentualData);
                console.log(`[PaperPoluicoes] internalPercentualData: ${JSON.stringify(internalPercentualData)}`);

                if (!props.stackedData || props.stackedData.length === 0) throw new Error('[PaperPoluicoes]: stackedData is required');
                setInternalStackedData(props.stackedData);
                console.log(`[PaperPoluicoes] internalStackedData: ${JSON.stringify(internalStackedData)}`);

                if (!props.countries) {
                    setInternalCountries(props.countries);
                    console.log(`[PaperPoluicoes] internalCountries loaded from props: ${internalCountries.length}`);
                } else {
                    setInternalCountries(contextCountries);
                    console.log(`[PaperPoluicoes] internalCountries loaded from context: ${internalCountries.length}`);
                }

                if (!props.states) {
                    setInternalStates(props.states);
                    console.log(`[PaperPoluicoes] internalStates loaded from props: ${internalStates.length}`);
                } else {
                    setInternalStates(contextStates);
                    console.log(`[PaperPoluicoes] internalStates loaded from context: ${internalStates.length}`);
                }

                if (!props.cities) {
                    setInternalCities(props.cities);
                    console.log(`[PaperPoluicoes] internalCities loaded from props: ${internalCities.length}`);
                } else {
                    setInternalCities(contextCities);
                    console.log(`[PaperPoluicoes] internalCities loaded from context: ${internalCities.length}`);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [
        props.percentualData,
        props.stackedData,
        props.countries,
        props.states,
        props.cities,
        contextCountries,
        contextStates,
        contextCities,
        contextStartDate,
        contextEndDate,
    ]);

    return (
        <div>
            <Paper
                component="form"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '96%',
                    padding: '10px',
                    margin: '10px',
                }}
            >
                <Stack spacing={2} sx={{ alignItems: 'center', width: '100%' }}>
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center', width: '100%' }}>

                        <Box sx={{ width: '100%', padding: '5px', margin: '5px' }}>
                            <StackRSuite spacing={10} direction="column" alignItems="flex-start" style={{ padding: '2px', margin: '2px' }}>
                                <DateRangePicker
                                    format="MMM yyyy"
                                    caretAs={BsCalendar2MonthFill}
                                    limitEndYear={1900}
                                    limitStartYear={new Date().getFullYear()}
                                    onChange={handleChangeRangeDates}
                                />
                            </StackRSuite>
                        </Box>

                        <FormControl
                            size="small"
                            sx={{
                                m: 1,
                                mt: 3,
                                minWidth: '100px',
                                maxWidth: '200px',
                                margin: '2px',
                                padding: '2px',
                            }}
                        >
                            <InputLabel id="paises-simple-select-label">País</InputLabel>
                            <Select
                                labelId="paises-simple-select-label"
                                id="paises-simple-select"
                                value={selectedCountry}
                                label="País"
                                onChange={handleChangeCountry}
                                sx={{
                                    borderRadius: '5px',
                                }}
                            >
                                {internalCountries?.map((y, k) => {
                                    return (
                                        <MenuItem key={k} value={y.pais}>
                                            {y.pais}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>

                        <FormControl
                            fullWidth
                            size="small"
                            sx={{
                                m: 1,
                                mt: 3,
                                minWidth: '100px',
                                maxWidth: '200px',
                                margin: '2px',
                                padding: '2px',
                            }}
                        >
                            <InputLabel id="states-simple-select-label">Estado</InputLabel>
                            <Select
                                labelId="states-simple-select-label"
                                id="states-simple-select"
                                value={selectedState}
                                label="Estado"
                                onChange={handleChangeState}
                                sx={{
                                    borderRadius: '5px',
                                }}
                            >
                                {internalStates?.map((y, k) => {
                                    return (
                                        <MenuItem key={k} value={y.estado}>
                                            {y.estado}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>

                        <FormControl
                            fullWidth
                            size="small"
                            sx={{
                                m: 1,
                                mt: 3,
                                minWidth: '100px',
                                maxWidth: '200px',
                                margin: '2px',
                                padding: '2px',
                            }}
                        >
                            <InputLabel id="cities-simple-select-label">Cidade</InputLabel>
                            <Select
                                labelId="cities-simple-select-label"
                                id="cities-simple-select"
                                value={selectedCity}
                                label="Cidade"
                                onChange={handleChangeCity}
                                sx={{
                                    borderRadius: '5px',
                                }}
                            >
                                {internalCities?.map((y, k) => {
                                    return (
                                        <MenuItem key={k} value={y.cidade}>
                                            {y.cidade}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Stack>

                    <Card variant="outlined" sx={{ width: '90%', backgroundColor: greenBackgroundColor }}>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Percentual de poluições por período de {`${contextStartDate?.getFullYear()} à ${contextEndDate?.getFullYear()}`}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Percentual consolidado, considerando dados para fertilizantes químicos,
                                fertilizantes orgânicos, manejo de esterco, deposição de extretas, queimas de resíduos de culturas.
                            </Typography>
                            <Suspense fallback={<Loading />}>
                                {internalPercentualData.length > 0 ? (
                                    <PercentualAreaChart width={1200} height={400} data={internalPercentualData} valueLabel="Área"  />
                                ) : (
                                    <Loading />
                                )}
                            </Suspense>
                        </CardContent>
                    </Card>

                    <Card variant="outlined" sx={{ width: '90%', backgroundColor: brownBackgroundColor }}>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Áreas Poluições por período {`${contextStartDate?.getFullYear()} à ${contextEndDate?.getFullYear()}`}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Números absolutos, consolidando dados de fertilizantes químicos,
                                fertilizantes orgânicos, manejo de esterco, deposição de extretas,
                                queimas de resíduos de culturas.
                            </Typography>
                            <Suspense fallback={<Loading />}>
                                {internalStackedData.length > 0 ? (
                                    <AreaChart width={1200} height={400} data={internalStackedData} defaultPalette={brownPalette}/>
                                ) : (
                                    <Loading />
                                )}
                            </Suspense>
                        </CardContent>
                    </Card>

                    <Card variant="outlined" sx={{ width: '90%', backgroundColor: yellowBackgroundColor }}>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Média Móvel de poluições por período de {`${contextStartDate?.getFullYear()} à ${contextEndDate?.getFullYear()}`}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Números absolutos, consolidando dados de fertilizantes químicos, fertilizantes orgânicos,
                                manejo de esterco, deposição de extretas, queimas de resíduos de culturas
                            </Typography>
                            <AreaChart width={1200} height={400} data={internalStackedData} defaultPalette={yellowPalette}/>
                        </CardContent>
                    </Card>
                </Stack>
            </Paper>
        </div>
    );
};

export default PaperPoluicoes;


