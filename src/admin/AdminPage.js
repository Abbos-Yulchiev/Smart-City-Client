import React, {useContext, useEffect} from 'react';
import {GlobalContext} from "../App";
import {getRequest} from "../resources/Request";
import {urlPath} from "../apiPath/urlPath";
import {TOKEN} from "../resources/Const";
import {toast} from 'react-toastify';

function AdminPage({history}) {

    const value = useContext(GlobalContext);

    async function getUser() {
        return await getRequest(urlPath.authToken);
    }

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            getUser().then(res => {
                if (res.data && res.status === 200) {
                    value.setLogged(true);
                    value.setUser(res.data.result);
                    toast.success('Successfully logged!')
                }
            }).catch(() => {
                localStorage.removeItem(TOKEN);
                value.setLogged(false);
                value.setUser('');
                history.push("/");
            })
        } else {
            value.setLogged(false);
            value.setUser('');
            history.push("/");
        }
    }, []);
    /*https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940
    https://images.pexels.com/photos/1209978/pexels-photo-1209978.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940*/
    return (
        <div style={{
            width: '100vw',
            height: '90vh',
            backgroundImage: `url("https://images.pexels.com/photos/1209978/pexels-photo-1209978.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}>
            <br/><br/>
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-4">
                            <div className="card text-white bg-success">
                                <div className="card-body">
                                    <h3 className="card-title text-white">Users</h3>
                                    <p className="card-text">
                                        User information. Adding new users and admins. Remove exist user and admins
                                    </p>
                                    <a href="/admin/UserList" className="btn bg-primary text-white border-light">
                                        More Info
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="card text-white bg-success">
                                <div className="card-body">
                                    <h3 className="card-title text-white">Recreation Places</h3>
                                    <p className="card-text">
                                        Send an application to city management for creating new Recreation places
                                    </p>
                                    <a href="/Admin/Recreation" className="btn bg-primary text-white border-light">
                                        More Info
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="card text-white bg-success">
                                <div className="card-body">
                                    <h3 className="card-title text-white">Events</h3>
                                    <p className="card-text">
                                        Send an application to city management for creating new
                                        Events
                                    </p>
                                    <a href="/Admin/Event" className="btn bg-primary text-white border-light">
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

export default AdminPage;