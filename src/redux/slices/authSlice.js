import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setSignOut: state => {
      state = initialState;
    },
  },
});

export const {setUser, setUserPolicies, setSignOut, setIsLoggedIn} =
  authSlice.actions;

export const selectIsLoggedIn = state => state.userAuth.isLoggedIn;
export const selectUser = state => state.userAuth.user;

export default authSlice.reducer;
