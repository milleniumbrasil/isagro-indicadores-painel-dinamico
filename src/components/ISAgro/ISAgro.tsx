// src/components/ISAgro/ISAgro.tsx

import React from "react";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Divider from "@mui/material/Divider";
import DirectionsIcon from "@mui/icons-material/Directions";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import { useISAgroContext } from "./ISAgroContext";

const RoundedPaper = styled(Paper)(({ theme }) => ({
  width: 180,
  height: 120,
  margin: "10px",
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: "center",
}));

const ISAgro: React.FC = () => {

  // dados do servidor armazenados no contexto
  const { data } = useISAgroContext();
  const { states } = useISAgroContext();

  console.log(`Dados do contexto: ${data}`);
  console.log(`Anos do contexto: ${states}`);

  // dados selecionados em tela
  const [pais, setPais] = React.useState('');
  const [ano, setAno] = React.useState('');
  const [estado, setEstado] = React.useState('');
  const [value, setValue] = React.useState<number[]>([20, 37]);
  
  const minDistance = 10;

  
  // manipuladores de eventos de tela
  const handleChangePaises = (event: SelectChangeEvent) => {
    setPais(event.target.value as string);
  };

  const handleChangeEstados = (event: SelectChangeEvent) => {
    setEstado(event.target.value as string);
  };

  const handleChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue([Math.min(newValue[0], value[1] - minDistance), value[1]]);
    } else {
      setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
    }
  };

  return (
    <div>
      <Paper
        component="form"
        sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: '100%' }}
      >
        <IconButton sx={{ p: "10px" }} aria-label="menu">
          {/* <MenuIcon /> */}
        </IconButton>
        <Box sx={{ minWidth: '250px', maxWidth: '300px', margin: '2px' }}>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search by typing"
            inputProps={{ "aria-label": "search by typing" }}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Box>

        <Divider sx={{ height: 28, m: 0.5, margin: '2px' }} orientation="vertical" />

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
              <MenuItem value={10}>Brasil</MenuItem>
              <MenuItem value={20}>Bolivia</MenuItem>
              <MenuItem value={30}>Peru</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ height: 28, m: 0.5, margin: '3px' }} orientation="vertical" />

        <Box sx={{ minWidth: '250px', maxWidth: '300px', margin: '2px', padding: '2px' }}>
          <Slider
            getAriaLabel={() => 'Years range'}
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            sx={{ margin: '3px' }}
          />
        </Box>

        <Divider sx={{ height: 28, m: 0.5, margin: '3px' }} orientation="vertical" />

        <Box sx={{ minWidth: '250px', maxWidth: '300px', margin: '2px', padding: '2px' }}>
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
              {states?.map((y) => {
                return <MenuItem key={y.uf} value={y.uf}>{y.estado}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Box>
        <IconButton color="primary" sx={{ p: "10px" }} aria-label="directions">
          <DirectionsIcon />
        </IconButton>
      </Paper>
      
      <Box sx={{ alignItems: 'center', width: '100%' }}>
        <h1>
          Dados do ISAgro - Por (município), estado, país por nutriente - N P K
        </h1>
      </Box>
      
      <Stack spacing={2} sx={{ alignItems: 'center' }}> 
        <Card variant="outlined" sx={{ maxWidth: '400px' }}>
          <CardContent>  
            <h3>Por (município), estado, país</h3>
            <h5>Por entrada - em %</h5>
            <ul>
              <li>
                <Typography variant="body2" gutterBottom>
                  Dejetos animais (suínos, galináceos)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                Deposição atmosférica
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                Fertilizantes minerais (por UF - ANDA _ com dificuldades)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                  Dejetos animais (suínos, galináceos)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                Fertilizantes orgânico (vinhaça) (por UF)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                Fixação Biológica de N (leguminosas, milho - 10% e cana, pastagens - 15 kg/ha ano)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                Sementes
                </Typography>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ maxWidth: '400px' }}>
          <CardContent>  
            <h4>Por (município), estado, país</h4>
            <h5>Por saída - em %</h5>
            <ul>
              <li>
                <Typography variant="body2" gutterBottom>
                produção carne bovina (por UF)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                produção agrícola
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                {`Pelo Balanço > por ha (área agropecuária - lavouras + pastagem (total) > balanço de nutrientes/área`}
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                lavouras + pastagem
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                {`Série Histórica - incluir curva de produção agrícola e carne bovina (rendimento)`}
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                Incluir FBN x produção agrícola
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                Distribuição Geográfica (BR, Estado, Regiões, Meso/ microregião.)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                Comparação outros países
                </Typography>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ maxWidth: '400px' }}>
          <CardContent>  
            <h4>Por nutriente - N P K</h4>
            <h5>Por entrada - em %</h5>
            <ul>
              <li>
                <Typography variant="body2" gutterBottom>
                  Dejetos animais (suínos, galináceos)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                Deposição atmosférica
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                Fertilizantes minerais (por UF - ANDA _ com dificuldades)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                  Dejetos animais (suínos, galináceos)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                Fertilizantes orgânico (vinhaça) (por UF)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                Fixação Biológica de N (leguminosas, milho - 10% e cana, pastagens - 15 kg/ha ano)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                Sementes
                </Typography>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ maxWidth: '400px' }}>
          <CardContent>  
            <h4>Por nutriente - N P K</h4>
            <h5>Por saída - em %</h5>
            <ul>
              <li>
                <Typography variant="body2" gutterBottom>
                produção carne bovina (por UF)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                produção agrícola
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                {`Pelo Balanço > por ha (área agropecuária - lavouras + pastagem (total) > balanço de nutrientes/área`}
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                lavouras + pastagem
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                {`Série Histórica - incluir curva de produção agrícola e carne bovina (rendimento)`}
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                Incluir FBN x produção agrícola
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                Distribuição Geográfica (BR, Estado, Regiões, Meso/ microregião.)
                </Typography>
              </li>
              <li>
                <Typography variant="body2" gutterBottom>
                Comparação outros países
                </Typography>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ maxWidth: '600px' }}>
          <CardContent>  
            {Array.isArray(data) ? (
              <ul>
                {data.map((dataItem, index) => (
                  <li key={`${dataItem.geocodigo}-${index}`}>
                    {dataItem.fonte} em {new Date(dataItem.data).getFullYear()} valor:{" "}
                    {dataItem.valor}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Carregando...</p>
            )}
          </CardContent>
        </Card>
      </Stack>
    </div>
  );
};

export default ISAgro;
