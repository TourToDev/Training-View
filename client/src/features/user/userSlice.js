import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    loading:"idle",
    basicInfo:{
        username:"",
        realName:"",
        avatar:"",
        age:0,
        weight:0,
        FTP:0,
    }
  },
  reducers: {
    usersLoading(state, action) {
        // Use a "state machine" approach for loading state instead of booleans
        if (state.loading === 'idle') {
          state.loading = 'pending'
        }
    },
    usersReceived(state, action) {
        if (state.loading === 'pending') {
            state.loading = 'idle'
            state.basicInfo = action.payload
        }
    }
  }
});



// Action creators are generated for each case reducer function
export const { usersLoading, usersReceived } = userSlice.actions;

export const fetchUsers = () => async dispatch => {
    dispatch(usersLoading())
    const response = await axios.get("/user/basicInfo",{withCredentials:true});
    dispatch(usersReceived(response.data))
  }

export default userSlice.reducer;