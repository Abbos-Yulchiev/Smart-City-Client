import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {Button, Container, Paper} from '@material-ui/core';
import {Redirect} from 'react-router-dom';
import {BASE_URL} from '../resources/Const';
import {urlPath} from '../apiPath/urlPath';
import axios from 'axios';
import {toast} from "react-toastify";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),

        },
    },
}));

export function SignUp({history}) {
    const classes = useStyles();
    const paperStyle = {padding: '40px', width: 400, margin: "30px auto"}
    const [citizenId, setCitizenId] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [prePassword, setPrePassword] = useState('')
    const [redirect, setRedirect] = useState(false);

    const handleClick = (e) => {
        e.preventDefault()
        const user = {citizenId, username, password, prePassword}

        if (password === prePassword) {
            axios.post(BASE_URL + urlPath.addUser, user)
                .then((response) => {
                    localStorage.setItem('token', response.data.token)
                    history.push('/components/SignIn');
                });
            setRedirect(true);
        }
        else {
            toast.error("Pre Password not match!")
        }
    }
    if (redirect) {
        return <Redirect to="/component/SignIn"/>
    }

    return (
        <Container>
            <Paper elevation={3} style={paperStyle}>
                <form className={classes.root} noValidate autoComplete="off">
                    <h1 style={{color: "#3F51B5"}}>Create account</h1>
                    <TextField id="outlined-basic" label="Citizen Id" variant="outlined" fullWidth
                               value={citizenId} onChange={(e) => setCitizenId(e.target.value)}
                    />
                    <TextField id="outlined-basic" label="Username" variant="outlined" fullWidth
                               value={username} onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField type="password" id="outlined-basic" label="Password" variant="outlined" fullWidth
                               value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField type="password" id="outlined-basic" label="Confirm password" variant="outlined" fullWidth
                               value={prePassword} onChange={(e) => setPrePassword(e.target.value)}
                    />
                    <div>
                        <Button variant="contained" color="primary" fullWidth onClick={handleClick}>
                            Commit
                        </Button>
                    </div>
                    <a href="/components/SignIn">Already have an account?
                    </a>
                </form>
            </Paper>
        </Container>
    );
}

export default SignUp;