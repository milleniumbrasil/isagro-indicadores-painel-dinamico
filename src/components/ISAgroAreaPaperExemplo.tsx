// src/components/ISAgro/ISAgro.tsx

import 'rsuite/dist/rsuite.min.css';

import React from "react";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { DateRangePicker, Stack as StackRSuite} from 'rsuite';
import { FaCalendar, FaClock } from 'react-icons/fa';
import { BsCalendar2MonthFill } from 'react-icons/bs';

import { useISAgroContext } from "./ISAgroContext";
import PercentualAreaChart from "./PercentualAreaChart";

const ISAgroAreaPaperExemplo: React.FC = () => {
  // dados do servidor armazenados no contexto
  const { states } = useISAgroContext();
  const { countries } = useISAgroContext();
  const { cities } = useISAgroContext();
  const { organicasPercentual } = useISAgroContext();

  // dados selecionados em tela
  const [pais, setPais] = React.useState("");
  const [estado, setEstado] = React.useState("");
  const [cidade, setCidade] = React.useState("");
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [endDate, setEndDate] = React.useState<Date>(new Date());

  // manipuladores de eventos de tela
  const handleChangePaises = (event: SelectChangeEvent) => {
    setPais(event.target.value as string);
  };

  const handleChangeEstados = (event: SelectChangeEvent) => {
    setEstado(event.target.value as string);
  };

  const handleChangeCidades = (event: SelectChangeEvent) => {
    setCidade(event.target.value as string);
  };

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

        <Stack spacing={2} sx={{ alignItems: "center" }}>

          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>

              <FormControl size="small" sx={{ m: 1, mt: 3, minWidth: "100px", margin: "2px", padding: "2px"}}>
                <InputLabel id="paises-simple-select-label">País</InputLabel>
                <Select
                  labelId="paises-simple-select-label"
                  id="paises-simple-select"
                  value={pais}
                  label="País"
                  onChange={handleChangePaises}
                  sx={{
                    borderRadius: "20px",
                  }}
                >
                  {countries?.map((y, k) => {
                    return (
                      <MenuItem key={k} value={y.pais}>
                        {y.pais}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" sx={{ m: 1, mt: 3, minWidth: "100px", margin: "2px", padding: "2px" }}>
                <InputLabel id="states-simple-select-label">Estado</InputLabel>
                <Select
                  labelId="states-simple-select-label"
                  id="states-simple-select"
                  value={estado}
                  label="Estado"
                  onChange={handleChangeEstados}
                  sx={{
                    borderRadius: "20px",
                  }}
                >
                  {states?.map((y, k) => {
                    return (
                      <MenuItem key={k} value={y.estado}>
                        {y.estado}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" sx={{ m: 1, mt: 3, minWidth: "100px", margin: "2px", padding: "2px" }}>
                <InputLabel id="cities-simple-select-label">Cidade</InputLabel>
                <Select
                  labelId="cities-simple-select-label"
                  id="cities-simple-select"
                  value={cidade}
                  label="Cidade"
                  onChange={handleChangeCidades}
                  sx={{
                    borderRadius: "20px",
                  }}
                >
                  {cities?.map((y, k) => {
                    return (
                      <MenuItem key={k} value={y.cidade}>
                        {y.cidade}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              
          </Stack>
          
          <StackRSuite spacing={10} direction="column" alignItems="flex-start" style={{ padding: '2px', margin: '2px'}}>
            <DateRangePicker format="MMM yyyy" caretAs={BsCalendar2MonthFill} />
          </StackRSuite>

          <Card variant="outlined" sx={{ width: "90%" }}>
            <CardContent>
              <h3>Percentual de áreas Organicas por período</h3>
              <h5>
                Percentual consolidado de uso da terra por período, considerando
                dados para Grãos, Hortaliças, Fruticulturas e Pastagens
              </h5>
              
              <PercentualAreaChart
                width={1200}
                height={400}
                data={organicasPercentual}
              />
            </CardContent>
          </Card>
        </Stack>
      </Paper>
    </div>
  );
};

export default ISAgroAreaPaperExemplo;
