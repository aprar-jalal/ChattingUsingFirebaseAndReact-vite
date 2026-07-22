import { Routes, Route } from "react-router-dom";
import SignUp from "./Pages/signUp/SignUp.jsx";
import Chat from "./Pages/Chat/Chat.jsx";
import {db} from "./config/firebase-config"
import { useState } from "react";
import Login from "./Pages/Login/Login.jsx";
import { useAuth } from "./Context/AuthContext.jsx";
function App() {
 const {user, loading} = useAuth();

console.log(user);
console.log(loading);
  return (
    
    <>
    <Routes>
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/" element={<Login />} />
      <Route path="/Chat" element={<Chat />} />
    </Routes>
    </>
  )
}

export default App
