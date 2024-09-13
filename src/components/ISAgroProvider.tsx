// src/components/ISAgro/ISAgroProvider.tsx

import React, { useState, useEffect, FC, ReactNode } from "react";
import GetNPKDataService from "../services/GetNPKDataService";
import GetStatesService from "../services/GetStatesService";
import GetCountriesService from "../services/GetCountriesService";
import GetCitiesService from "../services/GetCitiesService";
import GetOrganicaService from "../services/GetOrganicaService";
import GetErosaoDataService from "../services/GetErosaoDataService";
import GetGEEDataService from "../services/GetGEEDataService";
import GetNH3DataService from "../services/GetNH3DataService";
import GetPoluicaoDataService from "../services/GetPoluicaoDataService";
import { ICity, ICountry, IState, IPercentualAreaChart, IStackedAreaChart, ISAgroContextProps } from "../types";
import { ISAgroContext } from "./ISAgroContext";

export const ISAgroProvider: FC<{ children: ReactNode }> = ({ children }) => {

  const [states, setStates] = useState<IState[]>([]);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const [erosaoStackedData, setErosaoStackedData] = useState<IStackedAreaChart[]>([]);
  const [geeStackedData, setGeeStackedData] = useState<IStackedAreaChart[]>([]);
  const [nk3StackedData, setNh3StackedData] = useState<IStackedAreaChart[]>([]);
  const [npkStackedData, setNpkStackedData] = useState<IStackedAreaChart[]>([]);
  const [organicasStackedData, setOrganicasStackedData] = useState<IStackedAreaChart[]>([]);
  const [poluicaoStackedData, setPoluicaoStackedData] = useState<IStackedAreaChart[]>([]);

  const [organicasPercentual, setOrganicasPercentual] = useState<IPercentualAreaChart[]>([]);

  const getCountriesService = new GetCountriesService<ICountry[]>();
  const getStatesService = new GetStatesService<IState[]>();
  const getCitiesService = new GetCitiesService<ICity[]>();

  const getErosaoDataService = new GetErosaoDataService();
  const getGEEDataService = new GetGEEDataService();
  const getNH3DataService = new GetNH3DataService();
  const getNPKDataService = new GetNPKDataService();
  const getOrganicasService = new GetOrganicaService();
  const getPoluicaoDataService = new GetPoluicaoDataService();

  useEffect(() => {
    const fetchData = async () => {
      const tmpCountriesData = await getCountriesService.getData();
      setCountries(tmpCountriesData);

      const tmpStatesData = await getStatesService.getData();
      setStates(tmpStatesData);

      const tmpCitiesData = await getCitiesService.getData();
      setCities(tmpCitiesData);

      const tmpErosaoStackedData = await getErosaoDataService.getStackedData();
      setErosaoStackedData(tmpErosaoStackedData);

      const tmpGEEStackedData = await getGEEDataService.getStackedData();
      setGeeStackedData(tmpGEEStackedData);

      const tmpNH3StackedData = await getNH3DataService.getStackedData();
      setNh3StackedData(tmpNH3StackedData);

      const tmpNPKStackedData = await getNPKDataService.getStackedData();
      setNpkStackedData(tmpNPKStackedData);

      const tmpOrganicasStackedData = await getOrganicasService.getStackedData();
      setOrganicasStackedData(tmpOrganicasStackedData);

      const tmpOrganicasPercentualData = await getOrganicasService.getOrganicasAsPercentual();
      setOrganicasPercentual(tmpOrganicasPercentualData);

      const tmpPoluicaoStackedData = await getPoluicaoDataService.getStackedData();
      setPoluicaoStackedData(tmpPoluicaoStackedData);
    };

    fetchData();
  }, []);

  const value = {
    states,
    setStates,
    countries,
    setCountries,
    cities,
    setCities,
    organicas: organicasStackedData,
    setOrganicas: setOrganicasStackedData,
    organicasPercentual,
    setOrganicasPercentual,
  };

  return (
    <ISAgroContext.Provider value={value}>{children}</ISAgroContext.Provider>
  );
};
