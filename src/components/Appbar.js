import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import {Button,} from '@material-ui/core';
import Home from '@material-ui/icons/Home';
import {TOKEN} from "../resources/Const";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function Appbar(history) {

    const classes = useStyles();

    function logOut() {
        localStorage.removeItem(TOKEN);
        history.push('/');
    }

    return (
        <div className={classes.root}>
            <AppBar position="static" style={{backgroundColor: '#2c8c46'}}>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" href="/">
                        <Home/>
                    </IconButton>
                    <Typography className={classes.title}>
                        <h5 style={{color: 'white'}}>SMART CITY RECREATION</h5>
                    </Typography>
                    {
                        <>
                            <Button color="inherit" href="/components/SignIn" onClick={logOut}>
                                Logout
                            </Button>
                            <Button color="inherit" href="/components/SignIn">Sign In</Button>
                        </>
                    }
                </Toolbar>
            </AppBar>
        </div>
    );
}