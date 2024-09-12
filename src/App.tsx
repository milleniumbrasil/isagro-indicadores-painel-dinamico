
// src/App.tsx

import React from "react";
import { ISAgroProvider } from "./components/ISAgroContext";
import ISAgro from "./pages/Page";

const App: React.FC = () => {
  return (
    <ISAgroProvider>
      <ISAgro />
      {/* Outros componentes que precisem acessar o contexto ISAgroContext */}
    </ISAgroProvider>
  );
};

export default App;