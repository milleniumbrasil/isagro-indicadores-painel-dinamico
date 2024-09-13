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
  return context;
};
