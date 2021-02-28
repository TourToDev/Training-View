import React from 'react';
import { useFormik } from "formik";
import axios from "axios";
import './style.less';

const LoginPage = () => {
    const formik = useFormik({
        initialValues: { email: "" },
        onSubmit: values => {
          alert(JSON.stringify(values, null, 2));
          axios({
            method:"post",
            url:"http://localhost:4000/login",
            data:values,
          }).then(res=>alert(res.data))
        }
      });
      return (
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            placeholder="example@qq.com"
          />
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          <br />
          <button type="submit">Submit</button>
        </form>
      );
}

export default LoginPage;
