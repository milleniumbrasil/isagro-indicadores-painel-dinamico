// src/components/AnalysisProvider.tsx

import { FC, ReactNode } from 'react';
import { AnalysisContext } from './AnalysisContext';

export const AnalysisProvider: FC<{ children: ReactNode }> = ({ children }) => {


    const value = {
    };

    return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
};
