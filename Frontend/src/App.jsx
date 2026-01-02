import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import VideoDetail from "./pages/VideoDetail";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/watch/:id" element={<VideoDetail/>} />
    </Routes>
  );
};

export default App;
