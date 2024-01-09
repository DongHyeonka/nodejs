import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AddReview, Loginstate } from "./reducer/userSlice";
// import './review.css';

const Review = ({ review }) => {
    if (!review) {
        return null;
    }
    return (
        <tr>
            <td>{review.review_title}</td>
            <td>{review.review_content}</td>
            <td>{review.review_writer}</td>
            <td>{review.review_date.substring(0, 10)}</td>
            <td>
                <Link to={`/review/update/${review.review_id}`}>수정</Link>
                <Link to={`/review/delete/${review.review_id}`}>삭제</Link>
            </td>
        </tr>
    );
};

const ReviewList = () => {
    const reviews = AddReview((state) => state.reviews);
    const isLogin = Loginstate((state) => state.user?.isLogin);
    const [Reviews, setReviews] = useState([null]); //리뷰 목록을 담을 배열
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLogin) {
            navigate('/Login');
        } else {
            axios.get('http://localhost:5000/api/Review')
                .then(response => {
                    console.log(response.data);
                    setReviews(response.data);
                }
                ).catch((error) => {
                    console.log(error);
            });
        }
    }, [isLogin, navigate]);

    return (
        <div>
            <h3>Review List</h3>
            {Reviews === null ? (
               <div> 로딩 중...</div> 
            ) : Reviews.length === 0 ? (
                <div>리뷰가 없습니다.</div>
            ) : (
                <table className="table table-striped" style={{ marginTop: 20 }}>
                    <thead>
                        <tr>
                            <th>제목</th>
                            <th>내용</th>
                            <th>작성자</th>
                            <th>작성일</th>
                            <th>수정/삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Reviews.map((currentReview, i) => (
                            <Review review={currentReview} key={i} />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ReviewList;