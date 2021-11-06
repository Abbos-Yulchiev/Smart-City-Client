import {GlobalContext} from "../App";
import {useContext, useEffect} from "react";
import {getRequest} from "../resources/Request";
import {TOKEN} from "../resources/Const";


function Main({history}) {

    const value = useContext(GlobalContext);

    async function getUser() {
        return await getRequest("authorization/login");
    }

    useEffect(() => {
        getUser().then(res => {
            if (res.data && res.status === 200) {
                value.setLogged(true);
                value.setUser(res.data.result);
                history.push("/main")
            }
        }).catch(() => {
            localStorage.removeItem(TOKEN);
            value.setLogged(false);
            value.setUser('');
            history.push("/")
        })
    }, [])


    return (
        <div>
            <div style={{
                width: '100vw',
                height: '91vh',
                backgroundImage: `url("https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
            >
                <h1 style={{
                    color: "white",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh'
                }}
                >
                    WELCOME TO SMART CITY RECREATION
                </h1>
            </div>
        </div>
    )
}

export default Main