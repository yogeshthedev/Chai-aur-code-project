import React from "react";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<h1>home</h1>} />
      <Route path="/about" element={<h1>about</h1>} />
      <Route path="/contact" element={<h1>contact</h1>} />
    </Routes>
  );
};

export default App;
