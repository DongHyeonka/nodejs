//로그인과 회원가입 기능을 구현한 서버
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 5000;
const crypto = require('crypto');
const dbconf = require('./conf/auth');
const nodemailer = require('nodemailer');
const session = require('express-session');
const MySQLStore = require("express-mysql-session")(session);
const cookieParser = require("cookie-parser");
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// application/json
app.use(bodyParser.json());

// const corsOptions = {
//     origin: 'http://localhost:3000',
//     credentials: true,
//     optionSuccessStatus: 200
// };

const sessionStore = new MySQLStore(dbconf);

app.use(cors());
app.use(session({
    secret: 'abcd1234',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure : true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended: true}));

// 쿠키 파싱
app.use(cookieParser());

//mysql로 연결
const mysql = require('mysql2');
const { send } = require('process');
const connection = mysql.createConnection(dbconf);

connection.connect();
// crypto => 모듈 설치법: npm install crypto --save

app.get('/', (req, res) => {
    res.json("success")
});

//회원가입
app.post('/api/Signup', function (req, res) {
	const name = req.body.name;
	const email = req.body.email;
	const id = req.body.id;
    const password = req.body.password;

    //회원가입 입력 유효성 검사
    if(id === '' || password === '' || name === '' || email === ''){
        res.send('입력되지 않은 정보가 있습니다.');
        return;
    }

    //비밀번호 복잡성 검사
    var regExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/; //최소한 하나의 알파벳 문자(a-z 또는 A-Z)가 포함되어야 함, 최소한 하나의 특수문자가 포함되어야 함, 최소한 하나의 숫자가 포함되어야 함, 비밀번호는 8~16자 이하여야한다.
    if(!regExp.test(password)){
        res.send('비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
        return;
    }

    //아이디 중복 검사
    var checkDuplicatesql = "SELECT user_id FROM Users WHERE user_id='" + id + "'";
    var checkDuplicateParams = [id];

	connection.query(checkDuplicatesql, checkDuplicateParams, function (err, rows, fields) {
        if (err) {
            throw err;
        }

        //아이디가 이미 존재하는 경우
        if(rows.length > 0){
            res.send('이미 사용중인 아이디입니다.');
            return;
        }

        crypto.randomBytes(64, function(err, buf){
            if(err){
                console.log(err);
                return;
            }

            const data = buf.toString('hex');

            crypto.pbkdf2(password, data, 100000, 64, 'sha512', function(err, key){
                if(err){
                    console.log(err);
                    return;
                }

                const hashedPassword = key.toString('hex');
        
                const sql = 'INSERT INTO Users (user_id, password, username, email, salt) VALUES (?, ?, ?, ?, ?)';
                const params = [id, hashedPassword, name, email, data];
                connection.query(sql, params, function(err, rows, fields){
                    if(err){
                        console.log(err);
                    } else {
                        const authNum = Math.random().toString().substring(2, 6);
                        sendEmail(email, authNum);
                        updateEmailCheck(email);
                        req.session.save(function(){
                            if (err) {
                                console.log(err);
                                return;
                            }
                            res.send('회원가입에 성공했습니다.');
                        });
                    }
                });
            });
        });
    });
});

//이메일 전송 함수
function sendEmail(email, authNum){
    const oAuth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );

    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    oAuth2Client.getAccessToken(function(err, accessToken) {
        if (err) {
            console.log(err);
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL,
                accessToken,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: '이메일 인증을 진행해주세요.',
            text: '인증번호는 ' + authNum + '입니다.',
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log('Email sent: ' + info.response);
            }
        });
    });
}

//이메일 확인 상태 업데이트 함수
function updateEmailCheck(email){
    var sql = 'UPDATE Users SET emailCheck=1 WHERE email=?';
    var params = [email];

    connection.query(sql, params, function(err, rows){
        if(err){
            console.log(err);
        }else{
            console.log('Email Check Update Success!');
        }
    });
}

//고유한 식별자 생성 함수
function createUUID(){
    var dt = new Date().getTime(); // 현재 시간을 밀리세컨드로 구함

    //uuid 패턴인 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'의 x와 y를 랜덤한 숫자로 대체하여 uuid 생성
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
        //랜덤한 숫자 생성 (0이상 16미만 이하 소수점은 버림)
        var r = (dt + Math.random()*16)%16 | 0;
        //16진수로 변환하고 그 값을 다음 순번의 문자에 활용함
        dt = Math.floor(dt/16);
        // x와 y를 16진수로 대체할 문자를 생성하는 과정임
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });

    return uuid;
}

//JWT 토큰 발급 함수
function generateToken(user) {
    const secret = process.env.JWT_SECRET || 'mydefaultsecretkey';
    const token = jwt.sign(
        {
            id: user.user_id,
            name: user.username,
            email: user.email,
        },
        secret,
        {
            expiresIn: '1h',
        },
    );
    return token;
}

//JWT 토큰 검증 함수
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if(authHeader) {
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mydefaultsecretkey');
            req.userData = decoded;
            next();
        } catch (err) {
            return res.status(401).json({
                message: '인증 실패',
            });
        }
    } else {
        return res.status(401).json({
            message: '인증 실패 여기',
        });
    }
}

//JWT 토큰 검증 라우터
app.get('/api/Authenticated', verifyToken, (req, res) => {
    res.json({
      message: '인증 성공',
      user: req.userData,
    });
});

//로그인 기능
app.post('/api/Login', (req, res) => {
	const id = req.body.id;
	const pw = req.body.password;
	const sql = "SELECT salt, password from Users WHERE user_id = '" + id + "';"
    const params = [id];

    connection.query(sql, params, function(err, rows){
        if(err){
            console.log(err);
        } else {
            if(rows.length === 0){
                res.send('사용자가 없습니다.');
            } else {
                const user = rows[0];

                crypto.pbkdf2(pw, user.salt, 100000, 64, 'sha512', function(err, key){
                    if(err){
                        console.log(err);
                        return;
                    }

                    const hashPassword = key.toString('hex');

                    const isPasswordMatched = bcrypt.compare(hashPassword, user.password);
                    if(isPasswordMatched){
                        const token = generateToken(user);
                        res.json({
                            token: token,
                        });
                    } else {
                        res.send('비밀번호가 틀렸습니다.');
                    }
                });
            }
        }
    });
});

// 로그아웃 요청 처리
app.post('/api/Logout', function(req, res) {
    req.logout();
    req.session.save((err) => {
        res.redirect('/');
    });
});

//인증된 사용자만 접근 가능한 API
app.get('/api/Profile', isAuthenticated, function(req, res) {
    res.json({
      message: '인증된 사용자만 접근 가능한 API',
      user: req.user,
    });
});

// 인증된 사용자만 접근 가능한 라우터
function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
      return next();
    } else {
      res.status(401).json({ message: '로그인이 필요합니다.' });
    }
}

//리뷰 작성 로직
app.post('/api/Review', isAuthenticated, (req, res) => {
    const review_title = req.body.review_title;
    const review_content = req.body.review_content;
    const review_rating = req.body.review_rating;
    const userId = req.body.user_id;
    console.log(userId);
    const sql = 'INSERT INTO review (user_id, title, content, rating) VALUES (?, ?, ?, ?)';
    const params = [userId, review_title, review_content, review_rating];
    console.log(params);
    connection.query(sql, params, function(err, rows){
        if(err){
            console.log(err);
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        } else {
            res.status(201).json({ message: '리뷰가 작성되었습니다.' });
        }
    });
});

//리뷰 수정 로직
app.put('/api/Review/:id', (req, res) => {
    const { title, content, rating} = req.body;
    const userId = req.user.userId; // 로그인한 사용자의 ID
    const reviewId = req.params.id; // 수정할 리뷰의 ID
  
    // 리뷰 데이터를 DB에서 찾아 수정
    const sql = 'UPDATE review SET title = ?, content = ?, rating = ?, WHERE id = ? AND user_id = ?';
    const params = [title, content, rating, reviewId, userId];
    connection.query(sql, params, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: '서버 에러' });
        } else if (rows.affectedRows === 0) {
            res.status(404).json({ message: '해당 리뷰가 없거나 권한이 없습니다.' });
        } else {
            res.send(rows);
        }
    });
    
});

//리뷰 삭제 로직
app.delete('/api/Review/:id', (req, res) => {
    const userId = req.user.id; // 로그인한 사용자의 ID
    const reviewId = req.params.id; // 삭제할 리뷰의 ID

    // 리뷰 데이터를 DB에서 찾아 삭제
    const sql = 'DELETE FROM review WHERE id = ? AND user_id = ?';
    const params = [reviewId, userId];
    connection.query(sql, params, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: '서버 에러' });
        } else if (rows.affectedRows === 0) {
            res.status(404).json({ message: '해당 리뷰가 없거나 권한이 없습니다.' });
        } else {
            res.send(rows);
        }
    });
});

//리뷰 목록 로직
app.get('/api/Review', (req, res) => {
    const sql = 'SELECT * FROM review';
    connection.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: '서버 에러' });
        } else {
            res.send(rows);
        }
    });
});

//서버 연결
app.listen(port, () => console.log(`서버 연결 ${port}!`));

//'googleapis' 모듈 설치
//npm install googleapis --save
//jwt 모듈 설치
//npm install jsonwebtoken --save
//bcrypt 모듈 설치법: npm install bcrypt --save
//passport 모듈 설치
//npm install passport --save
//LocalStrategy 모듈 설치
//npm install passport-local --save