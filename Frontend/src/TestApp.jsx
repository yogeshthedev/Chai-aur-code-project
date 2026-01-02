import React from "react";
import api from "./api/axios";
import { useState } from "react";

const TestApp = () => {
  const [user, setuser] = useState(null);
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");

  const loginApi = async ({ email, password }) => {
    const response = await api.post("/users/login", { email, password });
    console.log(response)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   loginApi({email,password})
  
  };
  console.log(user)

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        {/* Email or Username */}
        <div>
          <label>Email or Username</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setemail(e.target.value)}
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

        {/* Submit */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default TestApp;
