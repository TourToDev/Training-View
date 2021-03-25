import React, { useContext,  useEffect} from 'react'
import {useDispatch,useSelector} from "react-redux"
import {fetchUsers} from '../../features/user/userSlice'
import { Layout, Menu, Breadcrumb } from 'antd';
import "./index.less";
const { Header, Content, Footer } = Layout;
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
export default function TrainingViewApp() {
    const dispatch = useDispatch();
    const basicInfo = useSelector( state => state.user.basicInfo );
    const loading = useSelector(state => state.user.loading)
    useEffect(() => {
        dispatch(fetchUsers())
    }, [])
    return (
        <div className="tv-app">
           <Navbar />
        </div>
    )
}
