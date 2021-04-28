import { CheckCircleOutlined, TagOutlined } from '@ant-design/icons';
import { Calendar as ACalendar, Badge } from 'antd';
import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { isSameDay, secondsToHms } from '../../lib/timeUtils';
import WorkoutModal from '../WorkoutModal/WorkoutModal';
import "./index.less";

export default function Calendar() {
    const [workoutModalDate, setWorkoutModalDate] = useState( new Date().getTime() );
    const [workoutId, setWorkoutId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const wksCollection = useSelector( state => state.workoutsCollection.workoutsCollection )
    const dateCellRender = (value) => {
        const workoutTimestamp = new Date(value.utc()).getTime()
        const workoutArr = wksCollection.filter( wk => isSameDay(new Date(wk.workoutTimestamp), new Date(value.utc())) );
        if ( workoutArr.length === 0 ) {
            return (
                <div className="plus-block-container" onClick={()=>{
                    setModalVisible(true);
                    setWorkoutId(null);
                    setWorkoutModalDate(workoutTimestamp);
                }}>
                    <div className="plus-block calendar-plus-block">
                        +
                    </div>
                </div>

            )
        }
        const workout = workoutArr[0];
        const displayValue = getDisplayValues(workoutArr);
        const planned = workout.status === "planned";

        return (
            <div 
                className={`tv-app-calendar-workout ${planned? "workout-planned": null}`}
                onClick={()=>{
                    setModalVisible(true);
                    setWorkoutId(workout.workoutId);
                    setWorkoutModalDate(workoutTimestamp);
                }}
            >
                <div className={`value-container`}>
                    <span className="value"> { displayValue.duration } </span>
                    <span className="value"> {displayValue.distance} KM </span>
                    <span className="value"> {displayValue.TSS} TSS </span>
                </div>
                <div className={`icon-container ${planned? "icon-container-planned" : null}`}>
                    {planned? <TagOutlined /> :<CheckCircleOutlined/>}
                </div>
            </div>
        )
    }
    return (
        <div className="tv-app-calendar">
            <ACalendar dateCellRender={dateCellRender} />
            <WorkoutModal 
                visible={modalVisible} 
                setVisible={setModalVisible}
                date={workoutModalDate}
                workoutId={workoutId} 
                onClose={()=>{setModalVisible(false)}}
                setWorkoutId={setWorkoutId}
            />
        </div>
    )
}

function getDisplayValues(workoutsArr) {
    const result = {}
    if (workoutsArr.length === 0) {
        return result;
    } 
    
    if (workoutsArr[0].basic.duration) {
        result.duration = secondsToHms(workoutsArr[0].basic.duration);
        result.distance = workoutsArr[0].basic.distance;
        result.TSS = workoutsArr[0].power.TSS;
    } else if ( workoutsArr[0].planned && workoutsArr[0].planned.duration) {
        result.duration =secondsToHms(workoutsArr[0].planned.duration);
        result.distance = workoutsArr[0].planned.distance;
        result.TSS = workoutsArr[0].planned.TSS;
    }

    return result;
}