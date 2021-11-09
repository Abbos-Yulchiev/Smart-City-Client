import React, {createContext, useState} from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Appbar from './components/Appbar';
import Login from './components/SingIn'
import SingUp from './components/SingUp'
import AdminPage from './admin/AdminPage'
import Main from './components/Main'
import UserList from "./admin/UserList";
import Event from "./admin/Event";
import UserEvent from "./user/Event";
import Recreation from "./admin/Recreation";
import UserRecreation from "./user/Recreation";
import UserPage from "./user/UserPage";
import Tickets from "./components/Tickets"
import Order from "./user/Order"

export const GlobalContext = createContext();

function App() {
    const [logged, setLogged] = useState(false)
    const [user, setUser] = useState('')
    return (<GlobalContext.Provider value={{logged: logged, setLogged: setLogged, user: user, setUser: setUser}}>
        <div className="App">
            <Appbar/>
            <BrowserRouter>
                <Switch>
                    <Route exact path={"/components/SingIn"} component={Login}/>
                    <Route exact path={"/components/Tickets"} component={Tickets}/>
                    <Route exact path={"/components/SingUp"} component={SingUp}/>
                    <Route exact path={"/admin/Recreation"} component={Recreation}/>
                    <Route exact path={"/admin/UserList"} component={UserList}/>
                    <Route exact path={"/admin/Event"} component={Event}/>
                    <Route exact path={"/admin/AdminPage"} component={AdminPage}/>
                    <Route exact path={"/user/UserPage"} component={UserPage}/>
                    <Route exact path={"/user/Order"} component={Order}/>
                    <Route exact path={"/user/Event*"} component={UserEvent}/>
                    <Route exact path={"/user/Recreation"} component={UserRecreation}/>
                    <Route exact path={"*"} component={UserRecreation}/>
                    <Route exact path={"/"} component={Main}/>
                </Switch>
            </BrowserRouter>
        </div>
    </GlobalContext.Provider>);
}

export default App;
