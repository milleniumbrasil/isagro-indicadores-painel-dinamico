// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DefaultIndicatorPage from './pages/DefaultIndicatorPage';

// Obtém a base de rota da variável de ambiente, com um valor padrão se não estiver definida
const basePath = process.env.REACT_APP_BASE_PATH || '/default';
const defaultIndicator = process.env.REACT_APP_DEFAULT_INDICATOR || '/emissao-de-amonia';
const defaultYear = process.env.REACT_APP_DEFAULT_YEAR || '-2000';

const App: React.FC = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to={`${basePath}${defaultIndicator}${defaultYear}`} replace />} />
                    <Route path="/default/:indicator" element={<DefaultIndicatorPage />} />
                </Routes>
            </Router>
        </>
    );
};

export default App;
