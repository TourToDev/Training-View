import React, { useState, useContext, useEffect } from 'react';
import LoginPage from './LoginPage/LoginPage';
import SignUpPage from './SignUpPage/SignUpPage'
import TraingingViewApp from '../components/TrainingViewApp/TrainingViewApp';

import {
    BrowserRouter as Router,
    HashRouter,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory
  } from "react-router-dom";

import "../styles/index.less";
import axios from 'axios';

// Detect if user has login yes: send to / the app, no: send to /login
export const authContext = React.createContext();


const App = () => {
  const [user, setUser] = useState(false);

  return (
      <HashRouter>
        <authContext.Provider value={{user:user}}>
          <Switch>
            <Route path="/register">
              <SignUpPage/>
            </Route>
            <Route path="/login" >
              <LoginPage setUser={setUser}/>
            </Route>
            <PrivateRoute path="/" setUser={setUser}>
              <TraingingViewApp/>
            </PrivateRoute>
          </Switch>
        </authContext.Provider>
      </HashRouter>
  )  
}

const PrivateRoute = ({children, setUser, ...rest}) => {
  const auth = useContext(authContext);
  const history = useHistory();
  useEffect( () => {
   axios.get("http://localhost:3000/user/basicInfo",{
     method:"get",
     withCredentials:true,
   }).then(res=>{
     setUser(res.data);
     history.push("/");
   });
  },[]);

  return (
    <Route
      {...rest}
      render={
        ({location}) => {
          if (auth.user) {
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