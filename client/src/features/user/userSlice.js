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
      gender:"",
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
      trainingZones:{
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
    usersBasicLoading(state, action) {
      if (!state.loading) {
        state.loading = true;
      }
    },
    usersBasicReceived(state, action) {
      if (state.loading) {
          state.loading = false;
          state.basicInfo = action.payload
      }
    },
    usersUpdating(state,action) {
      if (!state.updating) {
        state.updating = true;
      }
    },
    userUpdated(state, action) {
      if (state.updating) {
        state.updating = false;
        Object.assign(state.basicInfo,action.payload);
      }
    },
    powerInfoLoading(state, action) {
      if (!state.loading) {
        state.loading = true;
      }
    },
    powerInfoReceived(state, action) {
      if (state.loading) {
          state.loading = false;
          state.powerInfo = action.payload
      }
    },
  }
});

export const { 
  usersBasicLoading, 
  usersBasicReceived,
  powerInfoLoading,
  powerInfoReceived,
  usersUpdating,
  userUpdated,
 } = userSlice.actions;

export const fetchUsers = () => async dispatch => {
    dispatch(usersBasicLoading());
    const basic = await fetch(
      "http://localhost:3000/userBasic/basicInfo",
      {
        mode:"cors",
        credentials:"include"
      }
    );
    const basicData = await basic.json();
    dispatch(usersBasicReceived(basicData));

    dispatch(powerInfoLoading());
    const power =  await fetch(
      "http://localhost:3000/userBasic/powerInfo",
      {
        mode:"cors",
        credentials:"include"
      }
    );
    const powerData = await power.json();
    dispatch(powerInfoReceived(powerData));
};

export const updateUser = data => async dispatch => {
    dispatch(usersUpdating());
    const result = await fetch(
      "http://localhost:3000/userBasic/updateBasicInfo",
      {
        mode:"cors",
        credentials:"include",
        method:"post",
        body:data,
      }
    );
    const resultText = await result.text();
    console.log(resultText);
    resultText==="Updated"? dispatch(userUpdated(data)): null;
};

export default userSlice.reducer;