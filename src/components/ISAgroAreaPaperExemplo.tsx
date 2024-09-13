// src/components/ISAgro/ISAgro.tsx

import "rsuite/dist/rsuite.min.css"

import { FC, useState, useEffect, SyntheticEvent, Suspense } from "react"
import Stack from "@mui/material/Stack"
import Paper from "@mui/material/Paper"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"

import { DateRangePicker, Stack as StackRSuite } from "rsuite"
import { BsCalendar2MonthFill } from "react-icons/bs"

import { useISAgroContext } from "./ISAgroContext"
import PercentualAreaChart from "./PercentualAreaChart"
import { DateRange } from "rsuite/esm/DateRangePicker"
import { ICity, ICountry, IPercentualAreaChart, IState } from "../types"

interface ISAgroAreaPaperExemploProps {
  countries: ICountry[]
  states: IState[]
  cities: ICity[]
  data: IPercentualAreaChart[]
}

export function Loading() {
  return <p><i>Loading...</i></p>;
}

const ISAgroAreaPaperExemplo: FC<ISAgroAreaPaperExemploProps> = (props) => {

  // dados do servidor armazenados no contexto
  const { countries: contextCountries } = useISAgroContext()
  const { states: contextStates } = useISAgroContext()
  const { cities: contextCities } = useISAgroContext()

  // dados internos do componente
  const [internalCountries, setInternalCountries] = useState<ICountry[]>([])
  const [internalStates, setInternalStates] = useState<IState[]>([])
  const [internalCities, setInternalCities] = useState<ICity[]>([])
  const [internalOrganicasPercentual, setInternalOrganicasPercentual] =
    useState<IPercentualAreaChart[]>([])

  // dados selecionados em tela
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date())
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date())

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!props.data || props.data.length === 0)
          throw new Error("ISAgroAreaPaperExemplo: data is required")

        setInternalOrganicasPercentual(props.data)
        console.log(
          `[ISAgroAreaPaperExemplo] organicasPercentual: ${JSON.stringify(
            internalOrganicasPercentual
          )}`
        )

        if (!props.countries) {
          setInternalCountries(props.countries)
          console.log(
            `[ISAgroAreaPaperExemplo] countries loaded from props: ${internalCountries.length}`
          )
        } else {
          setInternalCountries(contextCountries)
          console.log(
            `[ISAgroAreaPaperExemplo] countries loaded from context: ${internalCountries.length}`
          )
        }

        if (!props.states) {
          setInternalStates(props.states)
          console.log(
            `[ISAgroAreaPaperExemplo] states loaded from props: ${internalStates.length}`
          )
        } else {
          setInternalStates(contextStates)
          console.log(
            `[ISAgroAreaPaperExemplo] states loaded from context: ${internalStates.length}`
          )
        }

        if (!props.cities) {
          setInternalCities(props.cities)
          console.log(
            `[ISAgroAreaPaperExemplo] cities loaded from props: ${internalCities.length}`
          )
        } else {
          setInternalCities(contextCities)
          console.log(
            `[ISAgroAreaPaperExemplo] cities loaded from context: ${internalCities.length}`
          )
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
  }

  fetchData()
  }, [
    props.data,
    props.countries,
    props.states,
    props.cities,
    contextCountries,
    contextStates,
    contextCities
  ])

  // manipuladores de eventos de tela
  const handleChangeCountry = (event: SelectChangeEvent) => {
    setSelectedCountry(event.target.value as string)
  }

  const handleChangeState = (event: SelectChangeEvent) => {
    setSelectedState(event.target.value as string)
  }

  const handleChangeCity = (event: SelectChangeEvent) => {
    setSelectedCity(event.target.value as string)
  }

  const handleChangeRangeDates = (
    rangeDates: DateRange | null,
    event: SyntheticEvent<Element, Event>
  ) => {
    // preciso atribuir os valores de data para as variaveis startDate e endDate
    if (rangeDates) {
      rangeDates.map((date, index) => {
        if (index === 0) {
          setSelectedStartDate(date)
        } else {
          setSelectedEndDate(date)
        }
      })
    }
  }

  return (
    <div>
      <Paper
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          width: "96%",
          padding: "10px",
          margin: "10px",
        }}
      >
        <Stack spacing={2} sx={{ alignItems: "center", width: "100%" }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", width: "100%" }}
          >
            <StackRSuite
              spacing={10}
              direction="column"
              alignItems="flex-start"
              style={{ padding: "2px", margin: "2px" }}
            >
              <DateRangePicker
                format="MMM yyyy"
                caretAs={BsCalendar2MonthFill}
                limitEndYear={1900}
                limitStartYear={new Date().getFullYear()}
                onChange={handleChangeRangeDates}
              />
            </StackRSuite>

            <FormControl
              size="small"
              sx={{
                m: 1,
                mt: 3,
                minWidth: "100px",
                maxWidth: "200px",
                margin: "2px",
                padding: "2px",
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
                  borderRadius: "20px",
                }}
              >
                {internalCountries?.map((y, k) => {
                  return (
                    <MenuItem key={k} value={y.pais}>
                      {y.pais}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              size="small"
              sx={{
                m: 1,
                mt: 3,
                minWidth: "100px",
                maxWidth: "200px",
                margin: "2px",
                padding: "2px",
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
                  borderRadius: "20px",
                }}
              >
                {internalStates?.map((y, k) => {
                  return (
                    <MenuItem key={k} value={y.estado}>
                      {y.estado}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              size="small"
              sx={{
                m: 1,
                mt: 3,
                minWidth: "100px",
                maxWidth: "200px",
                margin: "2px",
                padding: "2px",
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
                  borderRadius: "20px",
                }}
              >
                {internalCities?.map((y, k) => {
                  return (
                    <MenuItem key={k} value={y.cidade}>
                      {y.cidade}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Stack>

          <Card variant="outlined" sx={{ width: "90%" }}>
            <CardContent>
              <h3>Percentual de áreas Organicas por período</h3>
              <h5>
                Percentual consolidado de uso da terra por período, considerando
                dados para Grãos, Hortaliças, Fruticulturas e Pastagens
              </h5>
              <p>{`${selectedStartDate.getFullYear()} - ${selectedEndDate.getFullYear()}`}</p>
              <Suspense fallback={<Loading />}>
                {internalOrganicasPercentual.length > 0 ? (
                  <PercentualAreaChart
                    width={1200}
                    height={400}
                    data={internalOrganicasPercentual}
                    valueLabel="Área"
                  />
                ) : (
                  <Loading />
                )}
              </Suspense>
            </CardContent>
          </Card>
        </Stack>
      </Paper>
    </div>
  )
}

export default ISAgroAreaPaperExemplo
