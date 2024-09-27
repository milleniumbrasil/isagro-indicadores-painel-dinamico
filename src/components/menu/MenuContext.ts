// src/components/MenuContext.tsx

import { createContext, useContext } from 'react';
import { ICountry } from "../charts/ICountry";
import { IState } from "../charts/IState";
import { ICity } from "../charts/ICity";

// Interface para o contexto
export interface MenuContextProps {
    contextCities: ICity[];
    contextStates: IState[];
    contextCountries: ICountry[];
    fetchData: () => Promise<boolean>;
}

// Criação do contexto
export const MenuContext = createContext<MenuContextProps>({
    contextCities: [],
    contextStates: [],
    contextCountries: [],
    fetchData: () => Promise.resolve(false),
});

// Hook para utilizar o contexto
export const useMenuContext = () => {
    const context = useContext(MenuContext);
    if (!context) {
        console.warn('[MenuContext]: deve ser usado dentro de um MenuProvider');
    }
    if (!context.contextCountries || context.contextCountries.length === 0) {
        console.warn('[MenuContext]: countries is required');
    } else console.log('[MenuContext]: countries loaded: ', context.contextCountries.length);
    if (!context.contextStates || context.contextStates.length === 0) {
        console.warn('[MenuContext]: states is required');
    } else console.log('[MenuContext]: states loaded: ', context.contextStates.length);
    if (!context.contextCities || context.contextCities.length === 0) {
        console.warn('[MenuContext]: cities is required');
    } else console.log('[MenuContext]: cities loaded: ', context.contextCities.length);
    return context;
};
