// src/App.tsx

import React from 'react';

import OrganicasPage from './pages/OrganicasPage';
import { OrganicasProvider } from './components/OrganicasProvider';

import NH3Page from './pages/NH3Page';
import { NH3Provider } from './components/NH3Provider';

import NPKPage from './pages/NPKPage';
import { NPKProvider } from './components/NPKProvider';

import GEEPage from './pages/GEEPage';
import { GEEProvider } from './components/GEEProvider';

import PesticidasPage from './pages/PesticidasPage';
import { PesticidasProvider } from './components/PesticidasProvider';

import ErosoesPage from './pages/ErosoesPage';
import { ErosoesProvider } from './components/ErosoesProvider';

const App: React.FC = () => {
    return (
        <>
        <PesticidasProvider>
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
        </NPKProvider>
        </>
    );
};

export default App;
