import React, {useContext, useEffect} from 'react';
import {GlobalContext} from "../App";
import {getRequest} from "../resources/Request";
import {TOKEN} from "../resources/Const";
import {Button} from "@material-ui/core";
import {urlPath} from "../apiPath/urlPath"

function Header() {

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
                }
            }).catch(() => {
                localStorage.removeItem(TOKEN);
                value.setLogged(false);
                value.setUser('');
            })
        } else {
            value.setLogged(false);
            value.setUser('');
        }
    }, [])

    return (
        <div>

        </div>)
}

export default Header
