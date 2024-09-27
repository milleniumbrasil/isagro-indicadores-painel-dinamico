// src/App.tsx

import React from 'react';

import OrganicasPage from './pages/OrganicasPage';
import { OrganicasProvider } from './components/organicas/OrganicasProvider';

import NH3Page from './pages/NH3Page';
import { NH3Provider } from './components/nh3s/NH3Provider';

import NPKPage from './pages/NPKPage';
import { NPKProvider } from './components/npks/NPKProvider';

import GEEPage from './pages/GEEPage';
import { GEEProvider } from './components/gees/GEEProvider';

import PoluicoesPage from './pages/PoluicoesPage';
import { PoluicoesProvider } from './components/poluicoes/PoluicoesProvider';

import PesticidasPage from './pages/PesticidasPage';
import { PesticidasProvider } from './components/pesticidas/PesticidasProvider';

import ErosoesPage from './pages/ErosoesPage';
import { ErosoesProvider } from './components/erosoes/ErosoesProvider';

const App: React.FC = () => {
    return (
        <>
        <PoluicoesProvider>
            <PoluicoesPage />
        </PoluicoesProvider>
        {/* <PesticidasProvider>
            <PesticidasPage />
        </PesticidasProvider>
        <ErosoesProvider>
            <ErosoesPage />
        </ErosoesProvider>
        <GEEProvider>
            <GEEPage />
        </GEEProvider>
        <OrganicasProvider>
            <OrganicasPage />
        </OrganicasProvider>
        <NH3Provider>
            <NH3Page />
        </NH3Provider>
        <NPKProvider>
            <NPKPage />
        </NPKProvider> */}
        </>
    );
};

export default App;
