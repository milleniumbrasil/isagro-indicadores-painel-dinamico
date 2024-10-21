// src/pages/HomePage.tsx

import 'rsuite/dist/rsuite.min.css';

import { FC, useEffect, useState, SyntheticEvent } from 'react';

import {
    Box,
    Typography,
    Skeleton,
    Container,
    Grid2 as Grid,
    Button,
} from '@mui/material';

import data from './home.data.json';

import { Loader } from 'rsuite';

export function Loading() {
    return (
        <div>
            <Loader backdrop content="loading..." vertical />
        </div>
    );
}

interface MediaProps {
    loading?: boolean;
  }

const Media: FC<MediaProps> = (props: MediaProps) => {
    const TEXT_MAX_HEIGHT = 80;
    const { loading = false } = props;

    // Estado para armazenar se o texto está expandido ou não
    const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

    // Função para alternar o estado expandido
    const handleToggleExpand = (index: number) => {
        setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
    };

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', '& > :not(style)': { m: 1 }, alignItems: 'center' }}>
                <Box sx={{ width: { xs: '100%', sm: '80%', md: '70%', lg: '60%' }, margin: '30px', padding: { xs: '15px', sm: '30px' } }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <img src="/logo-isagro.png" alt="Logo Isagro" style={{ width: '150px', height: 'auto', margin: '15px' }} />
                    </Box>
                    <Typography variant="h2" sx={{ textAlign: 'center', padding: '15px', margin: { xs: '10px', md: '15px' } }}>
                        Indicadores Agro-socioambientais do Brasil
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom sx={{ height: 'auto', margin: { xs: '15px', sm: '30px' }, textAlign: 'justify' }}>
                        Os indicadores agro-sociombientais constituem um conjunto de informações quantitativas capazes de identificar, avaliar e monitorar os impactos ambientais, sociais e econômicos relacionados às atividades agropecuárias. Métricas e Indicadores subsidiam a tomada de decisão por parte de agentes governamentais e da iniciativa privada, estabelecendo informações de grande valor estratégico e auxiliando nos processos de planejamento agroambiental e de gestão de políticas públicas. Isso permite identificar aspectos sensíveis e pontos fortes, modelar cenários e traçar tendências, contribuindo para a avaliação da sustentabilidade e resiliência da agropecuária brasileira. Esse ambiente digital disponibiliza índices e indicadores agro-socioambientais calculados após ajustes técnicos realizados pela equipe do Projeto IS_Agro (proposição do Ministério da Agricultura e Pecuária (MAPA), execução da Embrapa - Embrapa Solos, Embrapa Agrobiologia, Embrapa Meio Ambiente e a Assessoria Internacional da Embrapa em parceria com o Serviço Geológico do Brasil (SGB/CPRM).
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', margin: '50px' }}>
                        <img src="/MAPA_EMBRAPA_SGB_CPRM.jpeg" alt="MAPA e da EMBRAPA E SGB/CPRM" style={{ width: '100%', maxWidth: '700px', height: 'auto' }} />
                    </Box>
                </Box>
            </Box>

            <Container maxWidth="sm">
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {(loading ? Array.from(new Array(3)) : data).map((item, index) => (
                        <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
                            <Box key={index} sx={{ width: 210, marginRight: 0.5, my: 5 }}>
                                {item ? (
                                <img
                                    style={{ width: 210, height: 118 }}
                                    alt={item.title}
                                    src={item.src}
                                />
                                ) : (
                                <Skeleton variant="rectangular" width={210} height={118} />
                                )}
                                {item ? (
                                <Box sx={{ pr: 2 }}>
                                    <Typography gutterBottom variant="body2">
                                    {item.title}
                                    </Typography>
                                    <Typography
                                    variant="caption"
                                    sx={{ display: 'block', color: 'text.secondary' }}
                                    >
                                    {item.sub}
                                    </Typography>
                                    <Typography
                                    variant="caption"
                                    sx={{
                                        display: 'block',
                                        color: 'text.secondary',
                                        maxHeight: expanded[index] ? 'none' : `${TEXT_MAX_HEIGHT}px`,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        transition: 'max-height 0.3s ease',
                                    }}
                                    >
                                    {item.desc}
                                    </Typography>
                                    <Typography
                                    variant="caption"
                                    sx={{
                                        display: 'block',
                                        color: 'text.secondary',
                                        maxHeight: expanded[index] ? 'none' : `${TEXT_MAX_HEIGHT}px`,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        transition: 'max-height 0.3s ease',
                                    }}
                                    >
                                    {item.obs}
                                    </Typography>
                                    <Button size="small">Share</Button>
                                    <Button size="small" onClick={() => handleToggleExpand(index)}>
                                        {expanded[index] ? 'Voltar' : 'Saiba mais'}
                                    </Button>
                                </Box>
                                ) : (
                                <Box sx={{ pt: 0.5 }}>
                                    <Skeleton />
                                    <Skeleton width="60%" />
                                </Box>
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
};


const HomePage: FC = () => {
    return (
            <Media loading={false} />
    );
}

export default HomePage;

