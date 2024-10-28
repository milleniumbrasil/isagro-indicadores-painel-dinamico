// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AnoniaPage from './pages/AnoniaPage';

const App: React.FC = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<AnoniaPage />} />
                </Routes>
            </Router>
        </>
    );
};

export default App;
