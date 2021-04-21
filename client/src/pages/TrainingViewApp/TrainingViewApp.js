import React, { useEffect } from 'react'
import {useDispatch,useSelector} from "react-redux"
import {fetchUsers} from '../../features/user/userSlice'
import "./index.less";
import Navbar from '../../components/Navbar/Navbar';
import { Route, Switch } from 'react-router';
import MainBroad from '../../components/MainBroad/MainBroad';
import { fetchBasicWorkouts, fetchWeeklyWorkouts } from '../../features/workoutsCollection/workoutsCollectionSlice';
import Calendar from '../../components/Calendar/Calendar';

export default function TrainingViewApp() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchBasicWorkouts());
        dispatch(fetchWeeklyWorkouts());
    }, [])
    return (
        <div className="tv-app">
           <Navbar />
           <main className="tv-app-main">
                <Switch>
                    <Route path="/calendar">
                        <Calendar />
                    </Route>

                    <Route path="/">
                        <MainBroad/>
                    </Route>
                </Switch>
           </main>
        </div>
    )
}
