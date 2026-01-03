import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authThunks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error ,user} = useSelector(
    (state) => state.auth
  );

  const [identifier, setIdentifier] = useState("");

  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ identifier, password }));
  };

  useEffect(() => {
   if(isAuthenticated){
    navigate("/")
   }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        {/* Email or Username */}
        <div>
          <label>Email or Username</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter email or username"
          />
        </div>

        {/* Password */}
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Submit */}
        <button type="submit" disabled={loading}>
          {loading ? "logging in..." : "login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
