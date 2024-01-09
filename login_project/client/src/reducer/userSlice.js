import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'users',
    initialState: {
        usersList: [],
        reviewList: [],
        isLoading: false,
        isLogin: false,
        canWriteReview: true, //리뷰 작성 가능 여부
    },
    reducers: {
        // Login 성공시
        Loginstate: (state, {payload}) => {
            //name, id에 API 값 받아오기
            const {id, name} = payload;
            state.usersList.push({id, name});
            state.isLogin = true;
            return state;
        },
        // Login 실패시
        Logoutstate: (state) => {
            const userId = localStorage.getItem('userId');
            state.usersList = state.usersList.filter((user) => user.id !== userId);
            state.isLogin = false;
            return state;
        },
        //리뷰 작성시
        AddReview: (state, {payload}) => {
            const {id, name} = payload;
            state.reviewList.push({id, name});
            state.canWriteReview = false;
            return state;
        },
    },
});

export const {Loginstate, Logoutstate, AddReview} = userSlice.actions;
export default userSlice.reducer;