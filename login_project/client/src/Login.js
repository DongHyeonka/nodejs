import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { Loginstate } from "./reducer/userSlice";

function Login() {
    const [Id, setId] = useState('');
    const [password, setPassword] = useState('');
	  const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
	
    const handleFormSubmit = (e) => {
        e.preventDefault();
            
        axios.post('http://localhost:5000/api/Login', {
                id: Id,
                password: password
            }).then(function(res) {
                if (res.data === "사용자가 없습니다.") {
                  setErrorMessage('');
                  setErrorMessage('로그인에 실패했습니다. 아이디를 확인해주세요.');
                } else if(res.data === "비밀번호가 틀렸습니다."){
                  setErrorMessage('');
                  setErrorMessage('로그인에 실패했습니다. 비밀번호를 확인해주세요.');
                } else {
                  setErrorMessage('');
                  dispatch(Loginstate(Id));
                  localStorage.setItem('token', res.data.token);
                  localStorage.setItem('userId', Id);
                  authenticatedRequest();
                  navigate('/Home', { replace: true });
              }
            }).catch(error => {
                console.log(error);
                setErrorMessage('로그인에 실패했습니다. 다시 시도해주세요.');
            });
    };

    function authenticatedRequest() {
      const token = localStorage.getItem('token');
      if(!token) {
        setErrorMessage('로그인에 실패했습니다. 다시 로그인해주세요.');
        return;
      }

      axios.get('http://localhost:5000/api/Authenticated', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
    }
  
    return (
      <div className="page">
        <div className='titleWrap'>
          로그인
        </div>
        <div className='content'>
          <form onSubmit={handleFormSubmit}>
            <div className='inputTitle'>아이디</div>
            <div className='inputWrap'>
              <input
                className='input'
                type="text"
                placeholder="아이디"
                value={Id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <div style={{marginTop: "26px"}} className='inputTitle'>비밀번호</div>
            <div className='inputWrap'>
              <input
                className='input'
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className='errorMessageWrap'>
              {errorMessage && <p>{errorMessage}</p>}
            </div>
          </form>
        </div>
        <div>
          <button onClick={handleFormSubmit} type="submit" className='bottomButton'>로그인</button>
          <Link to="/Signup">
            <button className='bottomButton'>회원가입</button>
          </Link>
          <Link to="/">
            <button className='bottomButton'>홈화면</button>
          </Link>
        </div>
      </div>
    );
};

export default Login;