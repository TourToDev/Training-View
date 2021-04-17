import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, List, Tag } from 'antd'
import React from 'react'

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
    return hDisplay + mDisplay; 
}

export default function WeeklyListItem({item, setWorkoutModalDate, setWorkoutId, setModalVisible}) {
    //console.log(item);
    const workoutsArr = item.workouts;
    console.log(item);
    const nowDate = new Date();
    const weekDayToday = nowDate.getDay() === 0 ? 7 : nowDate.getDay();
    const difference = weekDayToday - item.dayNum;
    nowDate.setDate(nowDate.getDate()-difference);
    
    const plusSign = (<div className="plus-block" onClick={()=>{
        setModalVisible(true);
        setWorkoutModalDate(nowDate.getTime());
    }}>+</div>)

    const briefInfo = (
        <div>
            <p><i>Duration: </i>{workoutsArr.length===0?null:secondsToHms(workoutsArr[0].basic.duration)}</p>
            <p><i>Distance: </i> {workoutsArr.length===0?null:workoutsArr[0].basic.distance} km</p>
            <p><i>TSS</i> --</p>
        </div>
    )
    return (
        <List.Item 
            actions={[
            ]}
            className="tv-app-weeklylist-item"
        >
            <Tag>{item.day}</Tag>
            {workoutsArr[0]?<Tag>{workoutsArr[0].status}</Tag>:null}
            {workoutsArr.length===0? plusSign : briefInfo}
        </List.Item>
    )
}
