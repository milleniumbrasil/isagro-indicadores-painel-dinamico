// src/components/ISAgro/ISAgro.tsx

import React from "react";
import { useISAgroContext } from "./ISAgroContext";

const ISAgro: React.FC = () => {
  const { state } = useISAgroContext();

  return (
    <div>
      <h1>Dados do ISAgro</h1>
      {Array.isArray(state) ? (
        <ul>
          {state.map((dataItem, index) => (
            <li key={`${dataItem.geocodigo}-${index}`}>
              {dataItem.fonte}: {dataItem.valor}
            </li>
          ))}
        </ul>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default ISAgro;