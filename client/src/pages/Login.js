import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { SHA256, enc } from "crypto-js";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  function encrypt(password) {
    return SHA256(password).toString();
  }

  const login = () => {
    const encryptedPassword = encrypt(password);
    const data = { username: username, password: encryptedPassword };

    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        console.log(response);
        localStorage.setItem("accessToken", response.data);
        setAuthState(true);
        navigate("/");
      }
    });
    setUsername("");
    setPassword("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      login();
    }
  };

  return (
    <div className="loginContainer">
      <label>Username:</label>
      <input
        type="email"
        value={username}
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <label>Password:</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
        onKeyDown={handleKeyDown}
      />

      <button type="submit" id="submitBtn" onClick={login}>
        Login
      </button>
    </div>
  );
}

export default Login;
