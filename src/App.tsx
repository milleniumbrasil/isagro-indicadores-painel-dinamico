// src/App.tsx

import React from 'react';

import OrganicasPage from './pages/OrganicasPage';
import { OrganicasProvider } from './components/OrganicasProvider';

import NPKPage from './pages/NPKPage';
import { NPKProvider } from './components/NPKProvider';

const App: React.FC = () => {
    return (
        <>
        <OrganicasProvider>
            <OrganicasPage />
        </OrganicasProvider>
        {/* <NPKProvider>
            <NPKPage />
        </NPKProvider> */}
        </>
    );
};

export default App;
