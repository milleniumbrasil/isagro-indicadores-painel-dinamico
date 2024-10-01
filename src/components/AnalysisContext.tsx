

// src/components/AnalysisContext.ts

import { createContext, useContext } from 'react';


// Criação do contexto
export const AnalysisContext = createContext({});

// Hook para utilizar o contexto
export const useAnalysisContext = () => {
    const context = useContext(AnalysisContext);
    if (!context) {
        throw new Error('useAnalysisContext deve ser usado dentro de um AnalysisProvider');
    }
    return context;
};
