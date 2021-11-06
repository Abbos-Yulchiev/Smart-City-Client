import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button, Container, Paper } from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';
import { BASE_URL } from '../resources/Const';
import { urlPath } from '../apiPath/urlPath';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),

    },
  },
}));

export function SingUp(history) {
  const classes = useStyles();
  const paperStyle = { padding: '40px', width: 400, margin: "30px auto" }
  const [citizenId, setCitizenId] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [prePassword, setPrePassword] = useState('')
  const [email, setEmail] = useState('')
  const [redirect, setRedirect] = useState(false);

  const handleClick = (e) => {
    e.preventDefault()
    const user = { citizenId, username, password, prePassword, email }

    axios.post(BASE_URL + urlPath.addUser, user)
      .then((response) => {
        localStorage.setItem('token', response.data.token)
        history.push('/components/SingIn');
      });
    setRedirect(true);
  }
  if (redirect) {
    return <Redirect to="/SingIn"/>
  }
  
  return (
    <Container>
      <Paper elevation={3} style={paperStyle}>
        <form className={classes.root} noValidate autoComplete="off">
          <h1 style={{ color: "#3F51B5" }}>Create Account</h1>
          <TextField id="outlined-basic" label="Citzen Id" variant="outlined" fullWidth
            value={citizenId} onChange={(e) => setCitizenId(e.target.value)}
          />
          <TextField id="outlined-basic" label="Usrename" variant="outlined" fullWidth
            value={username} onChange={(e) => setUsername(e.target.value)}
          />
          <TextField type="password" id="outlined-basic" label="Password" variant="outlined" fullWidth
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <TextField type="password" id="outlined-basic" label="Pre Password" variant="outlined" fullWidth
            value={prePassword} onChange={(e) => setPrePassword(e.target.value)}
          />
          <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <Button variant="contained" color="primary" fullWidth onClick={handleClick}>
              Sing Up
            </Button>
          </div>
          <a href="/components/SingIn">Sing In?
          </a>
        </form>
      </Paper>
    </Container>
  );
}

export default SingUp;