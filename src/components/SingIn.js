import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {Button, Container, Paper} from '@material-ui/core';
import {useForm} from "react-hook-form";
import {BASE_URL, TOKEN, TOKEN_TYPE} from '../resources/Const';
import {urlPath} from "../apiPath/urlPath"
import axios from 'axios';
import {toast} from "react-toastify"


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

function SingIn({history}) {

    const classes = useStyles();
    const paperStyle = {padding: '40px', width: 400, margin: "30px auto"}
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const {handleSubmit, formState} = useForm({mode: "all"});
    const {isSubmitting} = formState;
    const onSubmit = data => {
        console.log(data);
    };

    function redirectToSignUp(){
        history.set("/components/SingUp")
    }


    const handleClick = (e) => {
        e.preventDefault()
        const user = {username, password}
        axios.post(BASE_URL + urlPath.login, user)
            .then(response => {
                if (response.status === 200 && response.data) {
                    localStorage.setItem(TOKEN, TOKEN_TYPE + response.data.object);
                    let a = 0;
                    response.data.roles.map((name, index) => {
                        if (name.includes("ADMIN"))
                            a++;
                    });
                    if (a > 0) {
                        toast.success("Successfully logged!");
                        history.push("/admin/AdminPage")
                    } else {
                        toast.success("Successfully logged!");
                        history.push("/user/UserPage")
                    }
                }
            }).catch(() => {
            toast.error("Username or password is wrong!");
        });
    }

    return (
        <Container>
            <Paper elevation={3} style={paperStyle}>
                <form className={classes.root} onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                    <h1 style={{color: "#3F51B5"}}>SING IN</h1>
                    <TextField
                        name="username"
                        type="text"
                        id="outlined-basic"
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        type="password"
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div>
                        <Button
                            href="#"
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleClick}
                            disabled={isSubmitting}
                        >
                            Login
                        </Button>
                    </div>
                    <a href="/components/SingUp" onClick={redirectToSignUp}>Create an account?
                    </a>
                </form>
            </Paper>
        </Container>
    );
}

export default SingIn;