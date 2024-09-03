// src/components/ISAgro/ISAgroContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";
import GetDataService from "../../services/GetDataService";
import { IData } from "./types";

// Interface para o contexto
interface ISAgroContextProps {
  state: IData[] | null;
  setState: React.Dispatch<React.SetStateAction<IData[] | null>>;
}

// Estado inicial
const initialState: IData[] | null = null;

// Criação do contexto
const ISAgroContext = createContext<ISAgroContextProps | undefined>(undefined);

// Provider do contexto
export const ISAgroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<IData[] | null>(initialState);

  const dataService = new GetDataService<IData[]>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await dataService.getData();
      
      // Verifica se o resultado é diferente do estado atual antes de atualizar
      if (JSON.stringify(result) !== JSON.stringify(state)) {
        setState(result as IData[] | null);
      }
    };

    fetchData();
    // Adiciona um array de dependências vazio para garantir que o useEffect seja executado apenas uma vez
  }, []); 

  const value = {
    state,
    setState
  };

  return (
    <ISAgroContext.Provider value={value}>
      {children}
    </ISAgroContext.Provider>
  );
};

// Hook para utilizar o contexto
export const useISAgroContext = () => {
  const context = useContext(ISAgroContext);
  if (!context) {
    throw new Error(
      `useISAgroContext deve ser usado dentro de um ISAgroProvider`,
    );
  }
  return context;
};