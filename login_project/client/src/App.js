import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './Main';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Review from './review';
import Noticeboard from './Noticeboard';
import './App.css';
import { Loginstate } from "./reducer/userSlice";

//main, login, signup 페이지 라우팅 구현
function App() {
  const isLogin = Loginstate((state) => state.user?.isLogin);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Signup" element={<Signup/>}/>
        <Route path="/Home" element={isLogin ? <Home/> : <Login/>}/>
        <Route path="/Home/Review" element={isLogin ? <Review/> : <Login/>}/>
        <Route path="/Home/Noticeboard" element={isLogin ? <Noticeboard/> : <Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
