import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import MainRoutes from "./routes/MainRoutes";
import { currentUser } from "./features/auth/authThunks";

const App = () => {
  const dispatch = useDispatch();
  const { authChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!authChecked) {
      dispatch(currentUser());
    }
  }, [dispatch, authChecked]);

  return <MainRoutes />;
};

export default App;
