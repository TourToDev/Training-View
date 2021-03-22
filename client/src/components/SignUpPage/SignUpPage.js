import React from 'react';
import axios from 'axios';
import { useFormik, Formik, Field, Form, ErrorMessage } from 'formik';
// A custom validation function. This must return an object

// which keys are symmetrical to our values/initialValues

const validate = values => {

  const errors = {};

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length > 15) {
    errors.password = 'Must be 15 characters or less';
  }

  if (!values.passwordCheck) {
    errors.passwordCheck = 'Required';
  } else if (values.passwordCheck.length > 20) {
    errors.passwordCheck = 'Must be 20 characters or less';
  } else if (values.passwordCheck !== values.password) {
    errors.passwordCheck = 'Password Is Not The Same As Above'
  }

  return errors;
};

const SignupForm = () => {

  // Pass the useFormik() hook initial form values, a validate function that will be called when
  // form values change or fields are blurred, and a submit function that will
  // be called when the form is submitted
  return (
    <Formik
        initialValues={{
            passwordCheck: '',
            email: '',
        }}
        validate={validate}
        onSubmit={values => {
            axios({
              method:"post",
              url:"http://localhost:3000/register",
              data:values,
            }).then( (res) => alert(res.data) )
        }}
    >   
        <Form>
            <label htmlFor="email">Email Address</label>
            <Field name="email" type="email" />
            <ErrorMessage name="email" />

            <label htmlFor="password">Password</label>
            <Field name="password" type="password" />
            <ErrorMessage name="password" />

            <label htmlFor="passwordCheck">Enter Password Again</label>
            <Field name="passwordCheck" type="password" />
            <ErrorMessage name="passwordCheck" />


            <button type="submit">Submit</button>
         </Form>
    </Formik>
  );

};
export default SignupForm;