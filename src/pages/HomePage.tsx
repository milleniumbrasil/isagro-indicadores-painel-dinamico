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
    );
};


const HomePage: FC = () => {
    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Home Page
            </Typography>
            <Media loading={false} />
        </Container>
    );
}

export default HomePage;

