
// src/App.tsx

import React from "react";
import { ISAgroProvider } from "./components/ISAgroContext";
import Page from "./pages/Page";

const App: React.FC = () => {
  return (
    <ISAgroProvider>
      <Page />
      {/* Outros componentes que precisem acessar o contexto ISAgroContext */}
    </ISAgroProvider>
  );
};

export default App;
