import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    loading:false,
    updating:false,
    basicInfo:{
      username:"",
      realName:"",
      email:"",
      avatar:"",
      age:0,
      weight:0,
      FTP:0,
    },
    powerInfo:{
      FTP:0,
      powerProfile:{
        max5s:0,
        max30s:0,
        max1mins:0,
        max5mins:0,
        max20mins:0,
        max60mins:0,
      },
      trainingZone:{
        activeRecovery:0,
        endurance:0,
        tempo:0,
        lactateThreshold:0,
        vo2Max:0,
        anaerobicCapacity:0,
        neuromuscular:0,
      }
    },
  },
  reducers: {
    usersLoading(state, action) {
      if (!state.loading) {
        state.loading = true;
      }
    },
    usersReceived(state, action) {
      if (state.loading) {
          state.loading = true;
          state.basicInfo = action.payload
      }
    },
    usersUpdating(state,action) {
      
    },
    userUpdated(state, loading) {

    },
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