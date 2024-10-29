// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DefaultIndicatorPage from './pages/DefaultIndicatorPage';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/default/:indicator" element={<DefaultIndicatorPage />} />
                </Routes>
            </Router>
        </>
    );
};

export default App;
