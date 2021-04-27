import { List, Tag } from 'antd'
import React from 'react'
import { secondsToHms } from '../../lib/timeUtils';


export default function WeeklyListItem({
        item, 
        setWorkoutModalDate, 
        setWorkoutId, 
        setModalVisible
    }) {
        
    const workoutsArr = item.workouts;
    
    const nowDate = new Date();
    const weekDayToday = nowDate.getDay() === 0 ? 7 : nowDate.getDay();
    const difference = weekDayToday - item.dayNum;
    nowDate.setDate(nowDate.getDate()-difference);
    
    const plusSign = (
                        <div className="plus-block" onClick={()=>{
                            setModalVisible(true);
                            setWorkoutModalDate(nowDate.getTime());
                            setWorkoutId(null);
                        }}>
                            +
                        </div>
                    );

    const briefInfo = (
        <div onClick={()=>{
            setModalVisible(true);
            setWorkoutModalDate(nowDate.getTime());
            setWorkoutId(workoutsArr[0].workoutId);
        }}>
            <p>
                <small>Duration: </small>
                {getDisplayValues(workoutsArr).duration}
            </p>
            <p>
                <small>Distance: </small>
                {getDisplayValues(workoutsArr).distance} KM
            </p>
            <p>
                {getDisplayValues(workoutsArr).TSS} TSS
            </p>
        </div>
    )
    return (
        <List.Item
            className="tv-app-weeklylist-item"
        >
            <Tag color="geekblue">{item.day}</Tag>
            {workoutsArr[0]?
                <Tag color={workoutsArr[0].status==="completed"? "green": "red"}>
                    {workoutsArr[0].status}
                </Tag>
                :
                null}
            {workoutsArr.length===0? plusSign : briefInfo}
        </List.Item>
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
    } else if (workoutsArr[0].planned.duration) {
        result.duration =secondsToHms(workoutsArr[0].planned.duration);
        result.distance = workoutsArr[0].planned.distance;
        result.TSS = workoutsArr[0].planned.TSS;
    }

    return result;
}