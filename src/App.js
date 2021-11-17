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
import Tickets from "./admin/Tickets"
import OrderTicket from "./user/OrderTicket"
import NoMatch from "./components/404Page"
import MyOrders from "./user/MyOrders";
import Orders from "./admin/Orders";
import OrderRecreation from "./user/OrderRecreation"

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
                    <Route exact path={"/admin/Tickets/:event_id"} component={Tickets}/>
                    <Route exact path={"/components/SingUp"} component={SingUp}/>
                    <Route exact path={"/admin/Recreation"} component={Recreation}/>
                    <Route exact path={"/admin/UserList"} component={UserList}/>
                    <Route exact path={"/admin/Event"} component={Event}/>
                    <Route exact path={"/admin/AdminPage"} component={AdminPage}/>
                    <Route exact path={"/admin/Orders/:recreation_id"} component={Orders}/>
                    <Route exact path={"/user/UserPage"} component={UserPage}/>
                    <Route exact path={"/user/OrderTicket/:event_id"} component={OrderTicket}/>
                    <Route exact path={"/user/OrderRecreation/:recreation_id"} component={OrderRecreation}/>
                    <Route exact path={"/user/Event*"} component={UserEvent}/>
                    <Route exact path={"/user/MyOrders"} component={MyOrders}/>
                    <Route exact path={"/user/Recreation*"} component={UserRecreation}/>
                    <Route exact path={"/"} component={Main}/>
                    <Route exact path={"*"} component={NoMatch}/>
                </Switch>
            </BrowserRouter>
        </div>
    </GlobalContext.Provider>);
}

export default App;
