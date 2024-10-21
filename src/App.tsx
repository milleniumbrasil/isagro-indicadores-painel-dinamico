// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AnoniaPage from './pages/AnoniaPage'; // Importa a página Anonia
import HomePage from './pages/HomePage';

const App: React.FC = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/anonia-page" element={<AnoniaPage />} />
                </Routes>
            </Router>
        </>
    );
};

export default App;
