import {configureStore} from '@reduxjs/toolkit';
import userSlice from './userSlice';

export default configureStore({
    reducer: {
        users: userSlice,
    },
    middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
        serializableCheck: false,
    }),
});

//Module not found: Error: Can't resolve '@reduxjs/toolkit' in 'C:\Users\user\Desktop\react\client\src\reducer' 에러 해결
//npm install @reduxjs/toolkit --save