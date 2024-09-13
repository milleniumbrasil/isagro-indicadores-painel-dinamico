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
import GetDataService from "../services/GetDataService";
import { ICity, ICountry, IData, IPercentualAreaChart, IStackedAreaChart, IState } from "../types";
import GetStatesService from "../services/GetStatesService";
import GetCountriesService from "../services/GetCountriesService";
import GetCitiesService from "../services/GetCitiesService";
import GetOrganicaService from "../services/GetOrganicaService";

// Interface para o contexto
interface ISAgroContextProps {
  data: IData[] | undefined;
  setData: Dispatch<SetStateAction<IData[] | undefined>>;
  years: string[] | undefined;
  setYears: Dispatch<SetStateAction<string[] | undefined>>;
  cities: ICity[] | undefined;
  setCities: Dispatch<SetStateAction<ICity[] | undefined>>;
  states: IState[] | undefined;
  setStates: Dispatch<SetStateAction<IState[] | undefined>>;
  countries: ICountry[] | undefined;
  setCountries: Dispatch<SetStateAction<ICountry[] | undefined>>;
  organicas: IStackedAreaChart[] | undefined;
  setOrganicas: Dispatch<SetStateAction<IStackedAreaChart[] | undefined>>;
  organicasPercentual: IPercentualAreaChart[] | undefined;
  setOrganicasPercentual: Dispatch<SetStateAction<IPercentualAreaChart[] | undefined>>;
}

// Estado inicial
const dataInitialState: IData[] | undefined = undefined;
const yearsInitialState: string[] | undefined = undefined;
const statesInitialState: IState[] | undefined = undefined;
const countriesInitialState: ICountry[] | undefined = undefined;
const citiesInitialState: ICity[] | undefined = undefined;
const organicasInitialState: IPercentualAreaChart[] | undefined = undefined;
const organicasPercentualInitialState: IPercentualAreaChart[] | undefined = undefined;

// Criação do contexto
const ISAgroContext = createContext<ISAgroContextProps | undefined>(undefined);

// Provider do contexto
export const ISAgroProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<IData[] | undefined>(dataInitialState);
  const [years, setYears] = useState<string[] | undefined>(yearsInitialState);
  const [states, setStates] = useState<IState[] | undefined>(statesInitialState);
  const [countries, setCountries] = useState<ICountry[] | undefined>(countriesInitialState);
  const [cities, setCities] = useState<ICity[] | undefined>(citiesInitialState);
  const [organicas, setOrganicas] = useState<IStackedAreaChart[] | undefined>(organicasInitialState);
  const [organicasPercentual, setOrganicasPercentual] = useState<IPercentualAreaChart[] | undefined>(organicasPercentualInitialState);

  const dataService = new GetDataService<IData[]>();
  const statesService = new GetStatesService<IState[]>();
  const countriesService = new GetCountriesService<ICountry[]>();
  const citiesService = new GetCitiesService<ICity[]>();
  const organicasService = new GetOrganicaService();

  useEffect(() => {
    const fetchData = async () => {
      // const result = await dataService.getData();
      // if (result) {
      //   setData(result as IData[]);
      //   if (Array.isArray(result)) {
      //     const uniqueYears = Array.from(new Set(result.map((dataItem) => new Date(dataItem.data).getFullYear().toString())));
      //     setYears(uniqueYears);
      //   }
      // }
      const statesData = await statesService.getData();
      setStates(statesData as IState[]);
      const countriesData = await countriesService.getData();
      setCountries(countriesData as ICountry[]);
      const citiesData = await citiesService.getData();
      setCities(citiesData as ICity[]);
      const organicasData = await organicasService.getData();
      if (!organicasData) {
        throw new Error('[ISAgroContext] Erro ao buscar os dados de orgânicas stacked');
      }
      setOrganicas(organicasData as IStackedAreaChart[]);
      const organicasPercentualData = await organicasService.getOrganicasAsPercentual();
      if (!organicasPercentualData) {
        throw new Error('[ISAgroContext] Erro ao buscar os dados de orgânicas/percentual');
      }
      setOrganicasPercentual(organicasPercentualData as IPercentualAreaChart[]);
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

