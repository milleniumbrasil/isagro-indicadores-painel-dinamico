// src/components/ISAgro/ISAgroContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ReactNode,
  FC,
} from "react";
import GetDataService from "../../services/GetDataService";
import { IData, IState } from "./types";
import GetStatesService from "../../services/GetStatesService";

// Interface para o contexto
interface ISAgroContextProps {
  data: IData[] | null;
  setData: Dispatch<SetStateAction<IData[] | null>>;
  years: string[] | null;
  setYears: Dispatch<SetStateAction<string[] | null>>;
  states: IState[] | null;
  setStates: Dispatch<SetStateAction<IState[] | null>>;
}

// Estado inicial
const dataInitialState: IData[] | null = null;
const yearsInitialState: string[] | null = null;
const statesInitialState: string[] | null = null;

// Criação do contexto
const ISAgroContext = createContext<ISAgroContextProps | undefined>(undefined);

// Provider do contexto
export const ISAgroProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<IData[] | null>(dataInitialState);
  const [years, setYears] = useState<string[] | null>(yearsInitialState);
  const [states, setStates] = useState<IState[] | null>(statesInitialState);

  const dataService = new GetDataService<IData[]>();
  const statesService = new GetStatesService<IState[]>();
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await dataService.getData();
      if (result) {
        setData(result as IData[]);
        if (Array.isArray(result)) {
          const uniqueYears = Array.from(new Set(result.map((dataItem) => new Date(dataItem.data).getFullYear().toString())));
          setYears(uniqueYears);
        }
      }
      const statesData = await statesService.getData();
      setStates(statesData as IState[]);
    };

    fetchData();
    // Adiciona um array de dependências vazio para garantir que
    // o useEffect seja executado apenas uma vez
  }, []);

  const value = {
    data,
    setData,
    years,
    setYears,
    states,
    setStates,
  };

  return (
    <ISAgroContext.Provider value={value}>{children}</ISAgroContext.Provider>
  );
};

// Hook para utilizar o contexto
export const useISAgroContext = () => {
  const context = useContext(ISAgroContext);
  if (!context) {
    throw new Error(
      `useISAgroContext deve ser usado dentro de um ISAgroProvider`
    );
  }
  return context;
};

