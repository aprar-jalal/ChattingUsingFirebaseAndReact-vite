import { Routes, Route } from "react-router-dom";
import SignUp from "./Pages/signUp/SignUp.jsx";
import Chat from "./Pages/Chat/Chat.jsx";
import {db} from "./config/firebase-config"
import { useState } from "react";
function App() {
 const []=useState([])
  return (
    <>
      <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/Chat" element={<Chat />} />
    </Routes>
    </>
  )
}

export default App
