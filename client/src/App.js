import React, { useState, useContext, useEffect } from 'react';
import store from "./store";
import {Provider} from 'react-redux'
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage'
import TraingingViewApp from './pages/TrainingViewApp/TrainingViewApp';

import {
    HashRouter,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory
  } from "react-router-dom";

import "./styles/index.less";
import '../node_modules/react-vis/dist/style.css';

import axios from 'axios';

// Detect if user has login yes: send to / the app, no: send to /login
export const authContext = React.createContext();


const App = () => {
  const [user, setUser] = useState(false);

  return (
    <Provider store={store}>
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
    </Provider>
  )
};

const PrivateRoute = ({children, setUser, ...rest}) => {
  const auth = useContext(authContext);
  const history = useHistory();
  useEffect( () => {
   axios({
     method:"get",
     url:"http://localhost:3000/userBasic/basicInfo",
     withCredentials: true,
   }).then(res =>{
     setUser(res.data);
     history.push("/")
   }).catch(reason => console.log(reason))
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