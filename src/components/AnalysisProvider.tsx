// src/components/AnalysisProvider.tsx

import { FC, ReactNode } from 'react';
import { IStackedAreaChart } from './charts/IStackedAreaChart';
import { IPercentualAreaChart } from './charts/IPercentualAreaChart';
import { AnalysisContext } from './AnalysisContext';

export const AnalysisProvider: FC<{ children: ReactNode }> = ({ children }) => {


    const value = {
    };

    return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
};
