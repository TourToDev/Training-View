import React from 'react';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';

import "../LoginPage/style.less";
import { useHistory } from 'react-router';

const validate = values => {

  const errors = {};

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.uname) {
    errors.uname = "Required"
  }

  if (!values.realName) {
    errors.realName = "Required"
  }

  if (!values.pw) {
    errors.pw = 'Required';
  } else if (values.pw.length > 15) {
    errors.pw = 'Must be 15 characters or less';
  }

  if (!values.pwCheck) {
    errors.pwCheck = 'Required';
  } else if (values.pwCheck.length > 20) {
    errors.pwCheck = 'Must be 20 characters or less';
  } else if (values.pwCheck !== values.pw) {
    errors.pwCheck = 'Password Is Not The Same As Above'
  }

  return errors;
};

const SignupForm = () => {

  // Pass the useFormik() hook initial form values, a validate function that will be called when
  // form values change or fields are blurred, and a submit function that will
  // be called when the form is submitted
  const history = useHistory();

  return (
    <div className="tv-boot">
      <nav>
        <h2 className="tv-boot-nav">Training View</h2>
      </nav>
      <div className="tv-boot-login">
        <h3 className="tv-boot-login-banner">Create Your Free Account</h3>

        <div className="tv-boot-login-container">
            <Formik
                  initialValues={{
                      email:'',
                      uname:'',
                      realName:'',
                      pw:'',
                      pwCheck: '',
                  }}
                  validate={validate}
                  onSubmit={values => {
                      axios({
                        method:"post",
                        url:"http://localhost:3000/register",
                        data:values,
                      }).then( (res) => {
                        console.log(res.data)
                        history.push("/login")
                      } )
                  }}
              >   
                  <Form>
                      <Field name="email" type="email" placeholder="Enter Your Email"/>
                      <span className="error">
                          <ErrorMessage name="email" />
                      </span>

                      <Field name="uname" type="text" placeholder="Enter Your Username"/>
                      <span className="error">
                          <ErrorMessage name="uname" />
                      </span>

                      <Field name="realName" type="text" placeholder="Enter Your Real Name"/>
                      <span className="error">
                          <ErrorMessage name="realName" />
                      </span>

                      <Field name="pw" type="password" placeholder="Enter Your Password" />
                      <span className="error">
                          <ErrorMessage name="pw" />
                      </span>

                      <Field name="pwCheck" type="password" placeholder="Enter Your Password Again"/>
                      <span className="error">
                          <ErrorMessage name="pwCheck" />
                      </span>

                      <button type="submit">Submit</button>
                  </Form>
              </Formik>
        </div>

       </div>

    </div>   
  );
};


export default SignupForm;