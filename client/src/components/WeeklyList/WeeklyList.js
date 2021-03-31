import React from 'react'
import {List} from 'antd';
import {TagOutlined} from '@ant-design/icons';
import "./index.less"

const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];

export default function WeeklyList() {
    return (
        <div className="tv-app-weeklylist">
            <div className="tv-app-weeklylist-planheader">
                <TagOutlined />
                <span className="tv-app-weeklylist-planheader-text">
                    Training Plans
                </span>
            </div>
            <List className="tv-app-weeklylist-list"
                size="large"
                header={<div>Header</div>}
                footer={<div>Footer</div>}
                bordered
                dataSource={data}
                renderItem={item => <List.Item>{item}</List.Item>}
            />
        </div>
    )
}
