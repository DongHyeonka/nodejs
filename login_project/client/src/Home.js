import React, { useState } from 'react';
import Logout from './Logout';
import { Loginstate } from "./reducer/userSlice";
import { useNavigate, Link} from 'react-router-dom';

function Home() {
    const isLogin = Loginstate((state) => state.user.isLogin);
    const navigate = useNavigate();
    const [selectedMenu, setSelectedMenu] = useState('');

    if (!isLogin) {
        navigate('/Login');
    }

    const handleMenuClick = (menu) => {
      setSelectedMenu(menu);
    }
    
    return (
      <div>
        <div>
            <h1>테스트</h1>
            <div>
                <span>사용자 이름</span>
                <Logout />
            </div>
        </div>
        <div>
            <ul>
                <li onClick={() => handleMenuClick('리뷰')}>
                  <Link to="/Home/Review">리뷰</Link>
                </li>
                <li onClick={() => handleMenuClick('게시판')}>
                  <Link to="/Home/Noticeboard">게시판</Link>
                </li>
            </ul>
        </div>
        <div>
            {selectedMenu === '리뷰' && <h2>리뷰 메뉴 선택됨</h2>}
            {selectedMenu === '게시판' && <h2>게시판 메뉴 선택됨</h2>}
        </div>
      </div>
    );
}

export default Home;