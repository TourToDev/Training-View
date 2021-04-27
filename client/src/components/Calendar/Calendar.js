import { CheckCircleOutlined } from '@ant-design/icons';
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
        return (
            <div 
                className="tv-app-calendar-workout"
                onClick={()=>{
                    setModalVisible(true);
                    setWorkoutId(workout.workoutId);
                    setWorkoutModalDate(workoutTimestamp);
                }}
            >
                <div className="value-container">
                    <span className="value"> { secondsToHms(workout.basic.duration) } </span>
                    <span className="value"> {workout.basic.distance} KM </span>
                    <span className="value"> {workout.power.TSS} TSS </span>
                </div>
                <div className="icon-container">
                    <CheckCircleOutlined/>
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
