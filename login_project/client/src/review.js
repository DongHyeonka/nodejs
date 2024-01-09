import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = () => {
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewContent, setReviewContent] = useState('');
    const [reviewRating, setReviewRating] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            console.log('인증 정보가 없습니다.');
            return;
          }

        axios.post('http://localhost:5000/api/Review', {
                title: reviewTitle,
                content: reviewContent,
                rating: reviewRating,
                user_id: userId
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // 토큰 포함
                }
            }).then(response => {
                console.log(response.data);
                setReviewTitle('');
                setReviewContent('');
                setReviewRating('');
            })
            .catch(error => {
                console.log(error);
        });
    };

    return (
        <div>
            <h2>리뷰 작성</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="reviewTitle">제목</label>
                    <input type="text" id="reviewTitle" value={reviewTitle} onChange={(event) => setReviewTitle(event.target.value)} />
                </div>
                <div>
                    <label htmlFor="reviewContent">내용</label>
                    <textarea id="reviewContent" value={reviewContent} onChange={(event) => setReviewContent(event.target.value)} />
                </div>
                <div>
                    <label htmlFor="reviewWriter">평점</label>
                    <input type="text" id="reviewWriter" value={reviewRating} onChange={(event) => setReviewRating(event.target.value)} />
                </div>
                <button onClick={handleSubmit} type="submit">작성 완료</button>
            </form>
        </div>
    );
};

export default ReviewForm;