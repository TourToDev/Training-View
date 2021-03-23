import React, { useContext } from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import "./index.less";
const { Header, Content, Footer } = Layout;
import {authContext} from '../App';
import axios from 'axios';

export default function TrainingViewApp() {
    const auth = useContext(authContext);

    return (
        <div>
            <Layout className="layout">
                <Header>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Menu.Item key="1">nav 1</Menu.Item>
                    <Menu.Item key="2">nav 2</Menu.Item>
                    <Menu.Item key="3">nav 3</Menu.Item>
                </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">
                    <button onClick={()=>axios.get("http://localhost:3000/user/basicInfo",{withCredentials:true}).then(res => console.log(res))}>Fetch Basic</button>                
                </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        </div>
    )
}
