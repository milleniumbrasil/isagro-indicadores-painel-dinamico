// src/App.tsx

import React from 'react';
import Page from './pages/Page';
import { ISAgroProvider } from './components/ISAgroProvider';

const App: React.FC = () => {
    return (
        <ISAgroProvider>
            <Page />
        </ISAgroProvider>
    );
};

export default App;
