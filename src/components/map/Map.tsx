
  // src/components/menu/Mapa.tsx

  import React, { useEffect, useState } from "react";
  import Drawer from '@mui/material/Drawer';
  import EditIcon from '@mui/icons-material/Edit';
  import InfoIcon from '@mui/icons-material/Info';
  import CloseIcon from '@mui/icons-material/Close';
  import RestartAltIcon from '@mui/icons-material/RestartAlt';

  import { Box, Fab, FormControl, FormControlLabel, FormGroup, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
  import Checkbox from '@mui/material/Checkbox';

  import Accordion from '@mui/material/Accordion';
  import AccordionSummary from '@mui/material/AccordionSummary';
  import AccordionDetails from '@mui/material/AccordionDetails';
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  import Divider from '@mui/material/Divider';
  import { iEstado, estados, Map } from 'isagro-map';

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

  const DashboardPage: React.FC = () => {

    const defaultState = estados['São Paulo'].bbox.join(',');
    const initialConfig: TileLayerConfig = {
      layers: "CCAR:BCIM_Unidade_Federacao_A",
      styles: "",
      format: "image/png",
      transparent: true,
      version: "1.1.1",
      crs: "EPSG:4326",
      uppercase: true,
      url: "https://geoservicos.ibge.gov.br/geoserver/wms",
      exceptions: "application/vnd.ogc.se_xml",
      bgcolor: "0xFEFFFF",
      width: 606,
      height: 558,
      bbox: defaultState,
      zoom: 6,
      customParams: {},
    };

    const [selectedStateName, setSelectedStateName] = useState<string>('São Paulo');
    const [selectedState, setSelectedState] = useState<iEstado>(estados['São Paulo']);
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

    const reset = () => {
      console.log('Resetting to initial config:', initialConfig);
      setSelectedState(estados['São Paulo']);
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

    return (
      <div>
        <Drawer anchor={'right'}
                open={open}
                onClose={() => setOpen(false)}
              >
              <Box sx={{ width: '600px', padding: '60px' }}>
                <Box sx={{ margin: '15px' }}>
                  <Fab color="default" size="small" aria-label="reset" onClick={() => reset()} sx={{ margin: '5px' }}>
                    <RestartAltIcon sx={{ margin: '10px' }}/>
                  </Fab>
                  <Fab color="error" size="small" aria-label="close" onClick={() => setOpen(false)} sx={{ margin: '5px' }}>
                    <CloseIcon sx={{ margin: '10px' }}/>
                  </Fab>
                </Box>

                <Accordion defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="estado-content"
                    id="estado-header"
                  >
                    <Typography>Estado</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>Ao selecionar um estado, o mapa deve exibir a imagem correspondente.</Typography>
                    <Divider variant="middle" sx={{ margin: '15px' }} />
                    <FormControl fullWidth>
                      <Select value={selectedStateName} onChange={handleStateChange}>
                        <MenuItem value=""><em>Selecione um estado</em></MenuItem>
                        {Object.keys(estados).map(e => (
                          <MenuItem value={e} key={e}>{e}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="layers-content"
                    id="layers-header"
                  >
                    <Typography>Layers</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>Defina as camadas do WMS (Web Map Service) que deseja carregar. Isso pode incluir camadas de mapas de diferentes fontes.</Typography>
                    <Divider variant="middle" sx={{ margin: '15px' }} />
                    <FormControl fullWidth sx={{ m: 1 }} disabled>
                      <TextField value={layers} onChange={(e) => setLayers(e.target.value)} />
                    </FormControl>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="format-content"
                    id="format-header"
                  >
                    <Typography>Format</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>Especifique o formato da imagem que será retornada pelo WMS, como "image/png" ou "image/jpeg".</Typography>
                    <Divider variant="middle" sx={{ margin: '15px' }} />
                    <FormControl fullWidth sx={{ m: 1 }} disabled>
                      <TextField value={format} onChange={(e) => setLayers(e.target.value)} />
                    </FormControl>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="styles-content"
                    id="styles-header"
                  >
                    <Typography>Styles</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>Defina o estilo de exibição das camadas, se aplicável. Isso pode incluir parâmetros específicos para estilização.</Typography>
                    <Divider variant="middle" sx={{ margin: '15px' }} />
                    <FormControl fullWidth sx={{ m: 1 }} disabled>
                      <TextField value={styles} onChange={(e) => setLayers(e.target.value)} />
                    </FormControl>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="version-content"
                    id="version-header"
                  >
                    <Typography>Version</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>Especifique a versão do WMS que está sendo usada, como "1.1.1" ou "1.3.0".</Typography>
                    <Divider variant="middle" sx={{ margin: '15px' }} />
                    <FormControl fullWidth sx={{ m: 1 }} disabled>
                      <TextField value={version} onChange={(e) => setLayers(e.target.value)} />
                    </FormControl>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="CRS-content"
                    id="CRS-header"
                  >
                    <Typography>CRS</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>Defina o Sistema de Referência de Coordenadas (CRS) que será usado para o mapa, como "EPSG:4326".</Typography>
                    <Divider variant="middle" sx={{ margin: '15px' }} />
                    <FormControl fullWidth sx={{ m: 1 }} disabled>
                      <TextField value={crs} onChange={(e) => setLayers(e.target.value)} />
                    </FormControl>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="options-content"
                    id="options-header"
                  >
                    <Typography>Size, zoom, color</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>Configure outras opções, como dimensões do mapa, cor de fundo e nível de zoom.</Typography>
                    <Divider variant="middle" sx={{ margin: '15px' }} />
                    <Box
                        component="form"
                        sx={{
                          '& .MuiTextField-root': { m: 1, width: '80px' },
                        }}
                        noValidate
                        autoComplete="off"
                      >
                      <TextField label="W:" type="number" variant="standard" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
                      <TextField label="H:" type="number" variant="standard" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
                      <TextField label="BG Color:" variant="standard" value={bgcolor} onChange={(e) => setHeight(Number(e.target.value))} />
                      <TextField label="Zoom:" type="number" variant="standard" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
                    </Box>
                    <FormGroup aria-label="position" row>
                      <FormControlLabel
                        value="start"
                        control={<Checkbox checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />}
                        label="Uppercase"
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        value="start"
                        control={<Checkbox checked={transparent} onChange={(e) => setTransparent(e.target.checked)} />}
                        label="Transparent"
                        labelPlacement="start"
                      />
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="URL-content"
                    id="URL-header"
                  >
                    <Typography>URL</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>Especifique a URL do serviço WMS que será utilizado.</Typography>
                    <Divider variant="middle" sx={{ margin: '15px' }} />
                    <FormControl fullWidth sx={{ m: 1 }} disabled>
                      <TextField value={url} onChange={(e) => setLayers(e.target.value)} />
                    </FormControl>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="exceptions-content"
                    id="exceptions-header"
                  >
                    <Typography>Exceptions</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>Defina como as exceções serão tratadas no WMS, como "application/vnd.ogc.se_xml".</Typography>
                    <Divider variant="middle" sx={{ margin: '15px' }} />
                    <FormControl fullWidth sx={{ m: 1 }} disabled>
                      <TextField value={exceptions} onChange={(e) => setLayers(e.target.value)} />
                    </FormControl>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="bbox-content"
                    id="bbox-header"
                  >
                    <Typography>BBox</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>Especifique o limite da caixa delimitadora (BBox) para a área de interesse no mapa.</Typography>
                    <Divider variant="middle" sx={{ margin: '15px' }} />
                    <FormControl fullWidth sx={{ m: 1 }} disabled>
                      <TextField value={bbox} onChange={(e) => setLayers(e.target.value)} />
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
            <Typography>Este dashboard foi desenvolvido para ajudar os desenvolvedores a entender como utilizar o componente de mapa, bem como para demonstrar a finalidade de cada um dos parâmetros configuráveis. O principal objetivo deste dashboard é fornecer uma interface interativa onde os desenvolvedores podem ajustar dinamicamente os inputs e observar o comportamento do componente de mapa em tempo real. Isso oferece uma visibilidade valiosa para qualquer pessoa que esteja trabalhando com componentes personalizados, permitindo ajustes e testes rápidos e eficazes.</Typography>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ display: 'flex', '& > :not(style)': { m: 1 } }}>
          <Box sx={{ flexGrow: 1 }}>
          <Map estado={selectedState}
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
              <RestartAltIcon sx={{ margin: '10px' }}/>
            </Fab>
            <Fab color="secondary" size="small" aria-label="close" onClick={() => setOpen(true)} sx={{ margin: '5px' }}>
              <EditIcon sx={{ margin: '10px' }}/>
            </Fab>
          </Box>
          <Box sx={{ margin: '10px' }}>
            <Typography variant="h6" sx={{ padding: '15px' }}>
            Utilização do Componente Mapa
            </Typography>
            <Typography variant="body2" sx={{ padding: '15px', width: '550px' }}>
            Este dashboard foi desenvolvido para ajudar os desenvolvedores a entender como utilizar o componente de mapa, bem como para demonstrar a finalidade de cada um dos parâmetros configuráveis. O principal objetivo deste dashboard é fornecer uma interface interativa onde os desenvolvedores podem ajustar dinamicamente os inputs e observar o comportamento do componente de mapa em tempo real. Isso oferece uma visibilidade valiosa para qualquer pessoa que esteja trabalhando com componentes personalizados, permitindo ajustes e testes rápidos e eficazes.
            </Typography>
            <Typography variant="body2">
              <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                <li><b>Estado:</b> {selectedStateName}</li>
                <li><b>Layers:</b> {layers}</li>
                <li><b>Styles:</b> {styles}</li>
                <li><b>Format:</b> {format}</li>
                <li style={{ maxWidth: '450px', wordWrap: 'break-word' }}>
                  <b>BBox:</b> {currentBbox}
                </li>
                <li style={{ maxWidth: '450px', wordWrap: 'break-word' }}>
                  <b>Center:</b> {currentCenter}
                </li>
                <li><b>Zoom:</b> {currentZoom}</li>
                <li><b>Transparent:</b> {transparent ? "true" : "false"}</li>
                <li><b>Version:</b> {version}</li>
                <li><b>CRS:</b> {crs}</li>
                <li><b>Uppercase:</b> {uppercase ? "true" : "false"}</li>
                <li><b>URL:</b> {url}</li>
                <li><b>Exceptions:</b> {exceptions}</li>
                <li><b>Width:</b> {width} <b>Height:</b> {height}</li>
              </ul>
            </Typography>
          </Box>
        </Box>
      </div>
    );
  };

  export default DashboardPage;
