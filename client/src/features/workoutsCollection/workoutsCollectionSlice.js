import { createSlice } from '@reduxjs/toolkit'

export const workoutsCollectionSlice = createSlice(
    {
        name:"workoutsCollection",
        initialState:{
            workoutsBasicLoading:false,
            workoutsDetailLoading:false,
            workoutsCollection:[],
            weeklyWorkoutsLoading:false,
            weeklyWorkouts:[
                {
                    "day": "Mon",
                    "workouts": [
                    ]
                },
                {
                    "day": "Tue",
                    "workouts": []
                },
                {
                    "day": "Wed",
                    "workouts": []
                },
                {
                    "day": "Thur",
                    "workouts": []
                },
                {
                    "day": "Fri",
                    "workouts": []
                },
                {
                    "day": "Sat",
                    "workouts": []
                },
                {
                    "day": "Sun",
                    "workouts": [
                    ]
                }
            ],
        },
        reducers:{
            workoutsBasicLoading(state, action){
                
            },
            workoutsBasicLoaded(state, action){

            },
            weeklyWorkoutsLoading(state,action){
                if (!state.weeklyWorkoutsLoading) {
                    console.log("Set loading to true")
                    state.weeklyWorkoutsLoading = true;
                }
            },
            weeklyWorkoutsLoaded(state,action){
                if (state.weeklyWorkoutsLoading) {
                    console.log("Set loading to false")
                    state.weeklyWorkoutsLoading = false;
                }
                state.weeklyWorkouts = action.payload;
            },
            
        }
    }
)

export const {
    workoutsBasicLoading, 
    workoutsBasicLoaded, 
    weeklyWorkoutsLoading, 
    weeklyWorkoutsLoaded} = workoutsCollectionSlice.actions;

export const fetchWeeklyWorkouts = () => async (dispatch) => {
    dispatch(weeklyWorkoutsLoading());
    const res = await fetch(
        "http://localhost:3000/workoutsCollection/weeklyWorkout",
        {mode:"cors",
         credentials:"include"});
    const data = await res.json();
    dispatch(weeklyWorkoutsLoaded(data.weekInfo))
}


export default workoutsCollectionSlice.reducer;
