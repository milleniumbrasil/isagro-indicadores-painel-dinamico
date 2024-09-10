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
import { ICity, ICountry, IData, IOrganica, IOrganicaBySetor, IState } from "./types";
import GetStatesService from "../../services/GetStatesService";
import GetCountriesService from "../../services/GetCountriesService";
import GetCitiesService from "../../services/GetCitiesService";
import GetOrganicaService from "../../services/GetOrganicaService";

// Interface para o contexto
interface ISAgroContextProps {
  data: IData[] | null;
  setData: Dispatch<SetStateAction<IData[] | null>>;
  years: string[] | null;
  setYears: Dispatch<SetStateAction<string[] | null>>;
  cities: ICity[] | null;
  setCities: Dispatch<SetStateAction<ICity[] | null>>;
  states: IState[] | null;
  setStates: Dispatch<SetStateAction<IState[] | null>>;
  countries: ICountry[] | null;
  setCountries: Dispatch<SetStateAction<ICountry[] | null>>;
  organicas: IOrganicaBySetor[] | null;
  setOrganicas: Dispatch<SetStateAction<IOrganicaBySetor[] | null>>;
  organicasPercentual: IOrganica[] | null;
  setOrganicasPercentual: Dispatch<SetStateAction<IOrganica[] | null>>;
}

// Estado inicial
const dataInitialState: IData[] | null = null;
const yearsInitialState: string[] | null = null;
const statesInitialState: IState[] | null = null;
const countriesInitialState: ICountry[] | null = null;
const citiesInitialState: ICity[] | null = null;
const organicasInitialState: IOrganica[] | null = null;
const organicasPercentualInitialState: IOrganica[] | null = null;

// Criação do contexto
const ISAgroContext = createContext<ISAgroContextProps | undefined>(undefined);

// Provider do contexto
export const ISAgroProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<IData[] | null>(dataInitialState);
  const [years, setYears] = useState<string[] | null>(yearsInitialState);
  const [states, setStates] = useState<IState[] | null>(statesInitialState);
  const [countries, setCountries] = useState<ICountry[] | null>(countriesInitialState);
  const [cities, setCities] = useState<ICity[] | null>(citiesInitialState);
  const [organicas, setOrganicas] = useState<IOrganicaBySetor[] | null>(organicasInitialState);
  const [organicasPercentual, setOrganicasPercentual] = useState<IOrganica[] | null>(organicasPercentualInitialState);

  const dataService = new GetDataService<IData[]>();
  const statesService = new GetStatesService<IState[]>();
  const countriesService = new GetCountriesService<ICountry[]>();
  const citiesService = new GetCitiesService<ICity[]>();
  const organicasService = new GetOrganicaService();
  
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
      const countriesData = await countriesService.getData();
      setCountries(countriesData as ICountry[]);
      const citiesData = await citiesService.getData();
      setCities(citiesData as ICity[]);
      const organicasData = await organicasService.getGroupedbySetor();
      setOrganicas(organicasData as IOrganicaBySetor[]);
      if (Array.isArray(organicasData)) {
        const organicasPercentualData = await organicasService.getGroupedbySetorAsPercentual();
        setOrganicasPercentual(organicasPercentualData as IOrganica[]);
      } else {
        console.error("Error: organicasData is not of type IOrganica[]");
      }
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
    countries,
    setCountries,
    cities,
    setCities,
    organicas,
    setOrganicas,
    organicasPercentual,
    setOrganicasPercentual,
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

