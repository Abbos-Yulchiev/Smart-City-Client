import React, {useContext, useEffect} from "react";
import {GlobalContext} from "../App";
import {TOKEN} from "../resources/Const";
import {getRequest} from '../resources/Request'
import {urlPath} from '../apiPath/urlPath';
import {toast, ToastContainer} from "react-toastify";

function UserPage({history}) {

    const value = useContext(GlobalContext);
    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            getUser().then(res => {
                if (res.data && res.status === 200) {
                    value.setLogged(true);
                    value.setUser(res.data.result);
                }
            })/*.catch(() => {
                localStorage.removeItem(TOKEN);
                value.setLogged(false);
                value.setUser('');
                history.push("/");
            })*/
        } else {
            toast.success("Username or password incorrect!");
            value.setLogged(false);
            value.setUser('');
            history.push("/");
        }
    }, []);
    async function getUser() {
        return await getRequest(urlPath.authToken);
    }

    return (
        <div style={{
            width: '100vw',
            height: '90vh',
            backgroundImage: `url("https://images.pexels.com/photos/1188214/pexels-photo-1188214.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}>
            <br/><br/>
            <div>
                <div className="container justify-content-center" style={{display:"flex", alignSelf:"normal" }}>
                    <div className="row">
                        <div className="col-4">
                            <div className="card text-white bg-success">
                                <div className="card-body">
                                    <h3 className="card-title text-white">Recreation Places</h3>
                                    <br/>
                                    <a href="/User/Recreation" className="btn bg-primary text-white border-light">
                                        More Info
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="card text-white bg-success">
                                <div className="card-body">
                                    <h3 className="card-title text-white">Events</h3>
                                    <p className="card-text" style={{marginBottom: 9}}>
                                        See events
                                    </p>
                                    <br/>
                                    <a href="/User/Event" className="btn bg-primary text-white border-light">
                                        More Info
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="card text-white bg-success">
                                <div className="card-body">
                                    <h3 className="card-title text-white">Orders</h3>
                                    <p className="card-text" style={{marginBottom: 9}}>
                                        Your orders
                                    </p>
                                    <br/>
                                    <a href="/User/MyOrders" className="btn bg-primary text-white border-light">
                                        More Info
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserPage;