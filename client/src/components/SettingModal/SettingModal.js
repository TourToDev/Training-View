import { Modal, Menu, Form, Input } from 'antd';
import React, { useState } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';

import "./index.less";
import { useSelector } from 'react-redux';
const validate = values => {
    const errors = {}
  
    if (!values.uname) {
      errors.uname = "Required";
    }
  
    if (!values.pw) {
      errors.pw = "Required";
    } else if (values.pw.length > 15) {
      errors.pw = "Must be 15 chars and less";
    }
  
    return errors
}

export default function SettingModal(props) {
    const [selected, setSelected] = useState("personal");
    const basicInfo = useSelector(state => state.user.basicInfo)

    return (
        <Modal {...props}  width="1000"  okText="Save">
           
        </Modal>
    )
}
