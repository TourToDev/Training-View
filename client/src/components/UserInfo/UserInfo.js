import { useState } from "react";
import { usePopper } from 'react-popper';
import {useSelector} from "react-redux";
import { Menu, Dropdown } from 'antd';
import { Link } from "react-router-dom";
import AriaModal from 'react-aria-modal';
import "./index.less";
import SettingModal from "../SettingModal/SettingModal";
import Modal from "../Modal/Modal";
import HeaderText from "../HeaderText";

  


export default function UserInfo() {
    const basicInfo = useSelector(state => state.user.basicInfo)

    const [modalActive,setModalActive] = useState(false);
    const [selected, setSelected] = useState("personal")

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

    const title = (
      <h2 className="tv-usermodal-title">
        Account Setting
      </h2>
    )

    const personalInfo = (
      <HeaderText>
        Personal
      </HeaderText>
    )

    const powerInfo = (
      <HeaderText>
        Power
      </HeaderText>
    )

    const footer = (
      <button>Button</button>
    )
   
    let renderContent;
    if (selected==="personal") {
      renderContent = personalInfo
    } else if (selected==="power") {
      renderContent = powerInfo
    }

    return (
        <>
            <Dropdown overlay={menu} placement="bottomCenter" arrow>
                <span className="tv-app-nav-userinfo">
                    <span>{basicInfo.realName}</span>
                </span>
            </Dropdown>

            <Modal 
              title={title} 
              visible={modalActive} 
              onClose={() => setModalActive(false)} 
              footer={footer}
              bodyStyle={{
                maxWidth:"80vw",
                minWidth:"800px",
                height:"630px",
              }}
            >
            <div className="tv-app-userinfo">
              <ul className="tv-app-userinfo-sidebar">
                <li className={selected==="personal"?"selected" : null} onClick={()=>setSelected("personal")}>Personal</li>
                <li className={selected==="power"?"selected" : null} onClick={()=>setSelected("power")}>Power</li>
              </ul>
              <div className="tv-app-userinfo-content">
                {renderContent}
              </div>
            </div>
            </Modal>
        </>
    )
}