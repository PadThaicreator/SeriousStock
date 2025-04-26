// redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: '',  // เก็บ token
    user: {},   // user เป็น object ที่ยืดหยุ่น
  },
  reducers: {
    setUser: (state, action) => {
      state.token = action.payload.token;  // เก็บ token
      state.user = action.payload.user;    // เก็บข้อมูล user object
    },
    logout: (state) => {
      state.token = '';                    // ลบ token
      state.user = {};                     // ลบข้อมูล user
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
