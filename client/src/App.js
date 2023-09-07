import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Main from './pages/Main';
import Profile from './pages/Profile';

export const UserContext = React.createContext();

const App = () => {  
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{user, setUser}}>
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  )
}

export default App
