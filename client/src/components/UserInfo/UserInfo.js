import { useState } from "react";
import { usePopper } from 'react-popper';
import {useSelector} from "react-redux";
import { Menu, Dropdown } from 'antd';
import { Link } from "react-router-dom";
import AriaModal from 'react-aria-modal';
import "./index.less";


  


export default function UserInfo() {
    const basicInfo = useSelector(state => state.user.basicInfo)
    // const [referenceElement, setReferenceElement] = useState(null);
    // const [popperElement, setPopperElement] = useState(null);
    // const [arrowElement, setArrowElement] = useState(null);
    // const {styles, attributes} = usePopper(referenceElement, popperElement, {
    //     modifiers: [{name: 'arrow', options: {element: arrowElement }}]
    const [modalActive,setModalActive] = useState(false);

    
    const getApplicationNode = () => {
        return document.getElementById('app');
    };

    const menu = (
        <Menu className="tv-app-dropdown">
          <Menu.Item >
            <Link onClick={()=>setModalActive(true)}>Setting</Link>
          </Menu.Item>
          <Menu.Item disabled>
            Log out
          </Menu.Item>
        </Menu>
      );

    const modal = modalActive
      ? <AriaModal
          titleText="demo one"
          onExit={()=>setModalActive(false)}
          initialFocus="#demo-one-deactivate"
          underlayStyle={{ paddingTop: '2em' }}
          getApplicationNode={getApplicationNode}
        >
          <div id="demo-one-modal" className="modal">
            <div className="modal-body">
              <p>
                Here is a modal
                {' '}
                <a href="#">with</a>
                {' '}
                <a href="#">some</a>
                {' '}
                <a href="#">focusable</a>
                {' '}
                parts.
              </p>
            </div>
            <footer className="modal-footer">
              <button id="demo-one-deactivate" onClick={()=>setModalActive(false)}>
                deactivate modal
              </button>
            </footer>
          </div>
        </AriaModal>
      : false;

    return (
        <>

            <Dropdown overlay={menu} placement="bottomCenter" arrow>
                <span className="tv-app-nav-userinfo">
                    <span>{basicInfo.realName}</span>
                </span>
            </Dropdown>
            {modal}
        </>
    )
}