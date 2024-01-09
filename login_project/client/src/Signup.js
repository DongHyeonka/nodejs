//회원가입 기능 구현
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { Loginstate } from "./reducer/userSlice";

function Signup() {
	const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [Id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
	  const [error, setError] = useState('');
	  const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
	
	const handleFormSubmit = (e) => {
    e.preventDefault();

    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (password !== confirmPassword) {
      // 비밀번호가 일치하지 않는 경우 에러 처리
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 회원가입 처리 로직을 작성하고, 입력된 정보를 사용하여 처리합니다.
    axios
      .post('http://localhost:5000/api/Signup', {
			name: name, 
			email: email,
      id: Id,
			password: password
			}).then(function(response) {
			if(response.data === '이미 사용중인 아이디입니다.') {
				setMessage('사용자 아이디가 중복된다 티비 다른아이디 해줭');
				console.log('사용자 아이디가 중복된다 티비 다른아이디 해줭');
				setError('');
				
			} else if(response.data === '회원가입에 성공했습니다.'){
                console.log('성공티비~!');
                setMessage('성공티비~');
                setError('');
                dispatch(Loginstate(Id));
                navigate("/Login", { replace: true });
			} else if(response.data === '입력되지 않은 정보가 있습니다.'){
                console.log('입력 이슈');
                setMessage('입력 이슈');
                setError('');
			} else if(response.data === '비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.'){
                console.log('비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
                setMessage('비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
                setError('');
			}
      }).catch(function(error) {
            console.log(error);
			throw new Error(error);
      });

    // 입력 필드 초기화
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="page">
      <div className='titleWrap'>
        회원가입
      </div>
      <div className='content'>
        <form onSubmit={handleFormSubmit}>
          <div className='inputTitle'>이름</div>
          <div className='inputWrap'>
            <input
            className='input'
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div style={{marginTop: "26px"}} className='inputTitle'>이메일</div>
          <div className='inputWrap'>
            <input
            className='input'
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={{marginTop: "26px"}} className='inputTitle'>아이디</div>
          <div className='inputWrap'>
            <input
            className='input'
            type="id"
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
          <div style={{marginTop: "26px"}} className='inputTitle'>비밀번호 확인</div>
          <div className='inputWrap'>
            <input
            className='input'
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className='errorMessageWrap'>
            {error && <p>{error}</p>}
          </div>
        </form>
      </div>
      <div>
        <button onClick={handleFormSubmit} type="submit" className='bottomButton'>회원가입</button>
        <Link to="/Login">
          <button className='bottomButton'>로그인</button>
        </Link>
        <Link to="/">
          <button className='bottomButton'>홈화면</button>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
