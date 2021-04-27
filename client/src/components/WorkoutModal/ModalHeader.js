import React, { useRef } from 'react'
import { useDispatch} from 'react-redux';
import { fetchBasicWorkouts, fetchWeeklyWorkouts } from '../../features/workoutsCollection/workoutsCollectionSlice';
import { secondsToHms, hmsToSecond } from '../../lib/timeUtils';
import Button from '../Button/Button';


export default function ModalHeader({
    reducerState, 
    date, 
    modalMode, 
    setModalMode, 
    setWorkoutId}) {
    const state = reducerState;
    const uploadRef = useRef();
    const reduxDispatch = useDispatch();
    const workoutDate = new Date(date);
    return (
        <div className="tv-workoutmodal-header">
            <div className="tv-workoutmodal-datelabel">
                {`${weekdays[workoutDate.getDay()].toUpperCase()}  ${months[workoutDate.getMonth()]} ${workoutDate.getDate()}, ${workoutDate.getFullYear()}`}
            </div>
            <div className="tv-workoutmodal-briefcard">
                <span className="key-stats">
                    {state.basic.duration? secondsToHms(state.basic.duration) : "--:--:--"}
                </span>
                <span className="key-stats">
                    {state.basic.distance? state.basic.distance : "--"} KM
                </span>
                <span className="key-stats">
                    {state.power.TSS? state.power.TSS : "--"} TSS
                </span>
            </div>
            <div className="tv-workoutmodal-buttongroup">
                <Button onClick={()=> uploadRef.current.click()}>
                    Upload
                    <input 
                        ref={uploadRef} 
                        style={{display:"none"}} 
                        type="file" 
                        onChange={ async (e)=>{
                            const trainingFile = e.target.files[0];
                            const formData = new FormData();
                            formData.append('workoutfile', trainingFile);
                            formData.append("workoutTimestamp", date);
                            const res = await fetch("http://localhost:3000/workoutsCollection/add/upload",{
                                method:"post",
                                mode:"cors",
                                credentials:"include",
                                body:formData,
                            })
                            const resText = await res.text();
                            setWorkoutId(resText);
                            reduxDispatch(fetchWeeklyWorkouts());
                            reduxDispatch(fetchBasicWorkouts());
                    }}/>
                </Button>

                <button 
                    className="tv-workoutmodal-analyzebutton"
                    onClick={()=> { 
                        modalMode==="workout-form"?
                        setModalMode("analysis"):
                        setModalMode("workout-form")
                    }}
                > 
                    Analyze 
                </button>
            </div>
        </div>
    )
}

var weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturdays",
];

var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
