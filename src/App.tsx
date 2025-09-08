import React from "react";
import { Route, Routes } from "react-router-dom";
import { HelloWorld, MixTape, Palette } from "./views";

const App: React.FC = () => {
  
  return (
    <Routes>
      <Route path="/" element={<HelloWorld />} />
      <Route path="/mix-tape-maker" element={<MixTape />} />
      <Route path="/your-palette" element={<Palette />} />
    </Routes>
  );
};

export default App;