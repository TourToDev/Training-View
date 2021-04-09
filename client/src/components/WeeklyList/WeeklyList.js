import "./index.less"

import React, {useEffect} from 'react'
import {List} from 'antd';
import {TagOutlined} from '@ant-design/icons';
import WeeklyListItem from './WeeklyListItem';
import {useSelector, useDispatch} from "react-redux";

import {fetchWeeklyWorkouts} from "../../features/workoutsCollection/workoutsCollectionSlice"

export default function WeeklyList() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchWeeklyWorkouts());
    }, [])
    const weeklyWorkouts = useSelector(state => state.workoutsCollection.weeklyWorkouts)
    const weeklyWorkoutsLoading = useSelector( state => state.workoutsCollection.weeklyWorkoutsLoading )
    return (
        <div className="tv-app-weeklylist">
            <div className="tv-app-weeklylist-planheader">
                <TagOutlined />
                <span className="tv-app-weeklylist-planheader-text">
                    Training Plans
                </span>
            </div>
            <List className="tv-app-weeklylist-list"
                loading={weeklyWorkoutsLoading}
                size="large"
                dataSource={weeklyWorkouts}
                renderItem={item => <WeeklyListItem item={item}/>}
            />
        </div>
    )
}
