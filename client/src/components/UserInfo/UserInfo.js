import { useState } from "react";
import { usePopper } from 'react-popper';
import {useSelector} from "react-redux";
import { Menu, Dropdown } from 'antd';
import { Link } from "react-router-dom";
import AriaModal from 'react-aria-modal';
import "./index.less";
import SettingModal from "../SettingModal/SettingModal";
import Modal from "../Modal/Modal";

  


export default function UserInfo() {
    const basicInfo = useSelector(state => state.user.basicInfo)

    const [modalActive,setModalActive] = useState(false);


    const menu = (
        <Menu className="tv-app-dropdown">
          <Menu.Item >
            <span onClick={()=>setModalActive(true)}>Setting</span>
          </Menu.Item>
          <Menu.Item disabled>
            Log out
          </Menu.Item>
        </Menu>
      );

   

    return (
        <>
            <Dropdown overlay={menu} placement="bottomCenter" arrow>
                <span className="tv-app-nav-userinfo">
                    <span>{basicInfo.realName}</span>
                </span>
            </Dropdown>
            {/* <SettingModal 
              visible={modalActive}
              title="Setting"  
              onCancel={()=>setModalActive(false)}
            >
              
                    Setting Content
            </SettingModal> */}
            <Modal title="Title" visible={modalActive} onClose={() => setModalActive(false)}>
              Content
            </Modal>
        </>
    )
}