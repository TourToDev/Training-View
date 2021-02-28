import React, { useState, useContext } from 'react';
import LoginPage from './LoginPage/LoginPage';
import SignUpPage from './SignUpPage/SignUpPage'
import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer } = Layout;
import TraingingViewApp from '../components/TrainingViewApp/TrainingViewApp';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory
  } from "react-router-dom";

import "../styles/index.less";

// Detect if user has login yes: send to / the app, no: send to /login
const authContext = React.createContext();


const App = () => {
  const [auth, setAuth] = useState(false);


  return (
    <authContext.Provider value={{
      user:auth
    }}>
      <button onClick={()=>{
        setAuth(!auth)
        location.replace('/')
        
      }}>toggle auth</button>
      <Router>
        <Switch>
          <Route path="/register">
            <SignUpPage/>
          </Route>
          <Route path="/login">
            <LoginPage/>
          </Route>
          <PrivateRoute path="/">
            <TraingingViewApp/>
          </PrivateRoute>
        </Switch>
      </Router>
    </authContext.Provider>
  )

    //return (
    // <Router>
    //   <div>
    //     <ul>
    //       <li>
    //         <Link to="/">Register</Link>
    //       </li>
    //       <li>
    //         <Link to="/login">Login</Link>
    //       </li>
    //     </ul>
        
    //     <hr />

    //     {/*
    //       A <Switch> looks through all its children <Route>
    //       elements and renders the first one whose path
    //       matches the current URL. Use a <Switch> any time
    //       you have multiple routes, but you want only one
    //       of them to render at a time
    //     */}
    //     <Switch>
    //       <Route exact path="/">
    //         <SignUpPage />
    //       </Route>
    //       <Route path="/login">
    //       <LoginPage/>
    //       </Route>
    //     </Switch>
    //     </div>
    // </Router>
        // <div>
        //   <div className=" column column-1"></div>
        //   <div className="column column-2"></div>
        //   <div className="column column-3"></div>
        // </div>
    //);    
}

const PrivateRoute = ({children, ...rest}) => {
  const auth = useContext(authContext);

  return (
    <Route
      {...rest}
      render={
        ({location}) => {
          if (auth) {
            return children;
          } else {
            return (
              <Redirect to={{
                pathname:"/login",
                state:{from: location}
              }}/>
            );
          }
        }
      }
    />

  )
}

export default App;
