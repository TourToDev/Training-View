import "./index.less"

import React, {useEffect, useState} from 'react'
import {List, Spin} from 'antd';
import {LoadingOutlined, TagOutlined} from '@ant-design/icons';
import WeeklyListItem from './WeeklyListItem';
import {useSelector, useDispatch} from "react-redux";

import {fetchWeeklyWorkouts} from "../../features/workoutsCollection/workoutsCollectionSlice"
import HeaderText from "../HeaderText";
import WorkoutModal from "../WorkoutModal/WorkoutModal";

export default function WeeklyList() {

    const weeklyWorkouts = useSelector(state => state.workoutsCollection.weeklyWorkouts);
    const weeklyWorkoutsLoading = useSelector( state => state.workoutsCollection.weeklyWorkoutsLoading );

    const [workoutModalDate, setWorkoutModalDate] = useState( new Date().getTime() );
    const [workoutId, setWorkoutId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <div className="tv-app-weeklylist">
            <HeaderText icon={<TagOutlined />}>
                Training Plans
            </HeaderText>
            <Spin spinning={weeklyWorkoutsLoading} indicator={<LoadingOutlined style={{ fontSize: 24 }}/>}> 
                <List className="tv-app-weeklylist-list"
                    size="large"
                    dataSource={weeklyWorkouts}
                    renderItem={
                        item => 
                            <WeeklyListItem 
                                item={item} 
                                setWorkoutModalDate={setWorkoutModalDate} 
                                setWorkoutId={setWorkoutId}
                                setModalVisible = {setModalVisible}
                            />
                    }
                />
            </Spin>
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
