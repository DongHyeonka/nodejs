import React from 'react';
import { Link } from 'react-router-dom';

function Main() {

    return (
        <div className="page">
            <div className="content">
                <div className="titleWrap">
                    메인
                </div>
                <div className="content">
                    <Link to="/Login">
                        <button className='bottomButton'>로그인</button>
                    </Link>
                    <Link to="/Signup">
                        <button className='bottomButton'>회원가입</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Main;
