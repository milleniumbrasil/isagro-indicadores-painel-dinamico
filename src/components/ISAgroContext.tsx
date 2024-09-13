// src/components/ISAgro/ISAgroContext.tsx

import { createContext, useContext } from "react";
import { ISAgroContextProps } from "../types";

// Criação do contexto
export const ISAgroContext = createContext<ISAgroContextProps | undefined>(undefined);

// Hook para utilizar o contexto
export const useISAgroContext = () => {
  const context = useContext(ISAgroContext);
  if (!context) {
    throw new Error("useISAgroContext deve ser usado dentro de um ISAgroProvider");
  }
  if (!context.countries) {
    throw new Error("useISAgroContext: countries is required");
  }
  if (!context.states) {
    throw new Error("useISAgroContext: states is required");
  }
  if (!context.cities) {
    throw new Error("useISAgroContext: cities is required");
  }
  if (!context.erosaoStackedData) {
    throw new Error("useISAgroContext: erosaoStackedData is required");
  }
  if (!context.geeStackedData) {
    throw new Error("useISAgroContext: geeStackedData is required");
  }
  if (!context.nh3StackedData) {
    throw new Error("useISAgroContext: nh3StackedData is required");
  }
  if (!context.npkStackedData) {
    throw new Error("useISAgroContext: npkStackedData is required");
  }
  if (!context.organicasStackedData) {
    throw new Error("useISAgroContext: organicasStackedData is required");
  }
  if (!context.poluicaoStackedData) {
    throw new Error("useISAgroContext: poluicaoStackedData is required");
  }
  return context;
};
