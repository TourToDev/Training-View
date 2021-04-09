import React, { useEffect } from 'react'
import {useDispatch,useSelector} from "react-redux"
import {fetchUsers} from '../../features/user/userSlice'
import "./index.less";
import Navbar from '../../components/Navbar/Navbar';
import { Route, Switch } from 'react-router';
import MainBroad from '../../components/MainBroad/MainBroad';

export default function TrainingViewApp() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchUsers())
    }, [])
    return (
        <div className="tv-app">
           <Navbar />
           <main className="tv-app-main">
                <Switch>
                    <Route path="/calendar">

                    </Route>

                    <Route path="/">
                        <MainBroad/>
                    </Route>
                </Switch>
           </main>
        </div>
    )
}
