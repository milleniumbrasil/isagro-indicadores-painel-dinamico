
// src/App.tsx

import React from "react";
import { ISAgroProvider } from "./components/ISAgro/ISAgroContext";
import ISAgro from "./components/ISAgro/ISAgro";

const App: React.FC = () => {
  return (
    <ISAgroProvider>
      <ISAgro />
      {/* Outros componentes que precisem acessar o contexto ISAgroContext */}
    </ISAgroProvider>
  );
};

export default App;