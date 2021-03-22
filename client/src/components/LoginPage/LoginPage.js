import React, { useContext } from 'react';
import { useFormik, Formik, Field, Form, ErrorMessage } from 'formik';
import axios from "axios";
import './style.less';
import {authContext} from '../App';
import { useHistory } from 'react-router';


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

const LoginPage = ({setUser}) => {
   const history = useHistory()
   return (
     <div className="tv-boot">
      <nav>
        <h2 className="tv-boot-nav">Training View</h2>
      </nav>
      <div className="tv-boot-login">
        <h3 className="tv-boot-login-banner">Log In</h3>
        <div className="tv-boot-login-banner-2">
          Or <a href="/register">create an account</a> 
        </div>

        <div className="tv-boot-login-container">
          <Formik
            initialValues={{
              uname:"",
              pw:"",
            }}
            validate={validate}
            onSubmit={values => {
              axios({
                method:"post",
                url:"http://localhost:3000/login",
                data:values,
              })
              .then( res => {
                if (res.status===401) {
                  alert("Login Error");
                }
                if (res.status===200) {
                  setUser(res.data);
                  history.push("/");
                }
              } )
              .catch( res => {
                alert(res);
              } )
            }}
          >
            <Form>
              <Field name="uname" type="text" placeholder="Enter Your Username" />
              <span className="error">
                <ErrorMessage name="uname" />
              </span>
              <Field name="pw" type="password" placeholder="Enter Your Password" />
              <span className="error">
                <ErrorMessage name="pw"/>
              </span>
              <button type="submit">Login</button>
            </Form>
          </Formik>
        </div>
      </div>
     </div>
   )
}

export default LoginPage;
