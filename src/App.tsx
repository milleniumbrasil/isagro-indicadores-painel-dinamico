// src/App.tsx

import React from 'react';
import OrganicasPage from './pages/OrganicasPage';
import { OrganicasProvider } from './components/OrganicasProvider';

const App: React.FC = () => {
    return (
        <OrganicasProvider>
            <OrganicasPage />
        </OrganicasProvider>
    );
};

export default App;
