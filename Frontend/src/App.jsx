

import React,{ useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import MainRoutes from "./routes/MainRoutes";
import { currentUser } from "./features/auth/authThunks";

const App = () => {
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);



  return <MainRoutes />;
};

export default App;
