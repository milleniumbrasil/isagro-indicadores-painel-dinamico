// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DefaultIndicatorPage from './pages/DefaultIndicatorPage';

const App: React.FC = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/NH3" replace />} />  {/* Redireciona para uma rota padrão, como "NH3" */}
                    <Route path="/:indicator" element={<DefaultIndicatorPage />} />
                </Routes>
            </Router>
        </>
    );
};

export default App;
