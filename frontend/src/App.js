import "./App.css";
import React, { useState, useEffect } from "react";
// import Forgot from "./form/Forgot";
import Login from "./form/Login";
import Register from "./form/Register";
import Home from "./Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState();

  useEffect(() => {
    const auth = localStorage.getItem("auth_token");
    setToken(auth);
    console.log(token)
  }, [token]);

  return(
      <Routes>
        <Route exact path="/" element={<Login />}/>
        <Route exact path="/signup" element={<Register />}/>
        <Route exact path="/home" element={token ? <Home /> : <Login />}/>
      </Routes>
  )
}

export default App;
