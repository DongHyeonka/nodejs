import React from 'react';
import { useDispatch } from 'react-redux';
import { Logoutstate } from './reducer/userSlice';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(Logoutstate());
    navigate('/Login', { replace: true });
  };

  return (
    <button onClick={handleLogout}>로그아웃</button>
  );
}

export default Logout;