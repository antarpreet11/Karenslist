import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Main from './pages/Main';
import Profile from './pages/Profile';

const App = () => {  

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/signup" />} />
            <Route path="/main" element={<Main />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App