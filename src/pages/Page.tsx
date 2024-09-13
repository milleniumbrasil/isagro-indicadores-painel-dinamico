// src/components/ISAgro/ISAgro.tsx

import "./Page.css";

import { FC, useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useISAgroContext } from "../components/ISAgroContext";
import AreaChart from "../components/AreaChart";
import ISAgroAreaPaperExemplo from "../components/ISAgroAreaPaperExemplo";
import { IPercentualAreaChart } from "../types";

const Page: FC = () => {

  // dados do servidor armazenados no contexto
  const { states } = useISAgroContext();
  const { countries } = useISAgroContext();
  const { cities } = useISAgroContext();
  const { organicasStackedData } = useISAgroContext();
  const { organicasPercentual: contextOrganicasPercentual } = useISAgroContext();

  const [internalOrganicasPercentual, setInternalOrganicasPercentual] = useState<IPercentualAreaChart[]>([]);

  useEffect(() => {
    if (!contextOrganicasPercentual || contextOrganicasPercentual.length === 0) {
      throw new Error("Page: contextOrganicasPercentual is required");
    }
    setInternalOrganicasPercentual(contextOrganicasPercentual);
    console.log(`[Page] internalOrganicasPercentual loaded from context: ${contextOrganicasPercentual.length}`);
  }, []);

  // dados selecionados em tela
  const [pais, setPais] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [subsequenceRange, setSubsequenceRange] = useState<number>(1);

  const minDistance = 10;

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
        sx={{ display: "flex", alignItems: "center", width: '96%', padding: '10px', margin: '10px' }}
      >

        <Box sx={{ minWidth: '250px', maxWidth: '300px', margin: '2px', padding: '2px' }}>
          <FormControl size="small" sx={{ m: 1, mt: 3, minWidth: '250px' }}>
            <InputLabel id="paises-simple-select-label">País</InputLabel>
            <Select
              labelId="paises-simple-select-label"
              id="paises-simple-select"
              value={pais}
              label="País"
              onChange={handleChangePaises}
              sx={{
                borderRadius: '20px',
              }}
            >
              {countries?.map((y, k) => {
                return <MenuItem key={k} value={y.pais}>{y.pais}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ minWidth: '100px', maxWidth: '300px', margin: '2px', padding: '2px' }}>
          <FormControl fullWidth size="small" sx={{ m: 1, mt: 3 }}>
            <InputLabel id="states-simple-select-label">Estado</InputLabel>
            <Select
              labelId="states-simple-select-label"
              id="states-simple-select"
              value={estado}
              label="Estado"
              onChange={handleChangeEstados}
              sx={{
                borderRadius: '20px',
              }}
            >
              {states?.map((y, k) => {
                return <MenuItem key={k} value={y.estado}>{y.estado}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ minWidth: '100px', maxWidth: '300px', margin: '2px', padding: '2px' }}>
          <FormControl fullWidth size="small" sx={{ m: 1, mt: 3 }}>
            <InputLabel id="cities-simple-select-label">Cidade</InputLabel>
            <Select
              labelId="cities-simple-select-label"
              id="cities-simple-select"
              value={cidade}
              label="Cidade"
              onChange={handleChangeCidades}
              sx={{
                borderRadius: '20px',
              }}
            >
              {cities?.map((y, k) => {
                return <MenuItem key={k} value={y.cidade}>{y.cidade}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Box>

      </Paper>

      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <Card variant="outlined" sx={{ width: '90%' }}>
          <CardContent>
            <h3>Áreas Organicas</h3>
          </CardContent>
        </Card>

        {internalOrganicasPercentual.length > 0 && countries.length > 0 && states.length > 0 && cities.length > 0 ? (
              <ISAgroAreaPaperExemplo
                data={internalOrganicasPercentual}
                countries={countries}
                states={states}
                cities={cities}
              />
            ) : (
              <div>Carregando dados...</div>
            )}

        <Card variant="outlined" sx={{ width: '90%' }}>
          <CardContent>
            <h3>Áreas Organicas por período</h3>
            <h5>Números absolutos, consolidando dados de uso da terra por período, considerando Grãos, Hortaliças, Fruticulturas e Pastagens</h5>
            <AreaChart width={1200} height={400} data={organicasStackedData} />
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ width: '90%' }}>
          <CardContent>
            <div>
              <h1>Áreas Organicas</h1>
              <h5>Empilhados por Grão, Hortaliças, Fruticultura, Pastagens</h5>
              <div>
                <label>
                  Subsequências (anos):
                  <select value={subsequenceRange} onChange={(e) => setSubsequenceRange(Number(e.target.value))}>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </label>

              </div>
              <AreaChart width={1200} height={400} data={organicasStackedData} />
            </div>
          </CardContent>
        </Card>
      </Stack>
    </div>
  );
};

export default Page;
