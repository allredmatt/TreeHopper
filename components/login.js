import React             from 'react';
import { useState }      from "react"
import { makeStyles }    from '@mui/styles';
import Paper             from '@mui/material/Paper';
import Typography        from '@mui/material/Typography';
import IconButton        from '@mui/material/IconButton';
import OutlinedInput     from '@mui/material/OutlinedInput';
import InputLabel        from '@mui/material/InputLabel';
import InputAdornment    from '@mui/material/InputAdornment';
import FormControl       from '@mui/material/FormControl';
import Visibility        from '@mui/icons-material/Visibility';
import VisibilityOff     from '@mui/icons-material/VisibilityOff';
import MailOutlineIcon   from '@mui/icons-material/MailOutline';
import LockOpenIcon      from '@mui/icons-material/LockOpen';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button            from '@mui/material/Button';
import * as api          from '../components/apiCalls';
import Image             from 'next/image';

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: theme.spacing(-1),
        marginTop: theme.spacing(-1),
        paddingRight: theme.spacing(2),
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    paper: {
        backgroundColor: theme.palette.transparentBackground,
        backgroundImage: "none",
        width: '300px',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(1),
    },
    margin: {
        margin: theme.spacing(1),
    },
    bigBottomMargin: {
        marginBottom: theme.spacing(3),
    },
    line: {
        width: "60%",
        textAlign: "centre",
        borderColor: "hsla(123, 2%, 44% ,0.5)",
    },
    backgroundImage: {
        zIndex: -1,

    }
  }));

export function Login ({setToken}) {

    const [user, setUser] = useState({email: '', password: '', showPassword: false, name: ''})
    const [showRegister, setShowRegister] = useState(false)
    const [textForLoginButton, setTextForLoginButton] = useState('Login')
    const classes = useStyles()

    async function login () {
        setTextForLoginButton('Loading...')
        if(user.email && user.password) {
            api.login(user.email, user.password)
                .then((data) => setToken(data.secret))
                .catch((error) => {
                    setTextForLoginButton('Login')
                    console.log(error)
                })
        } else {
            //handle empty data input here
        }
    }

    const register = () => {
        setShowRegister(!showRegister)
    }

    async function newUser () {
        if(user.email && user.password && user.name) {
            api.newUser(user.name, user.email, user.password)
                .then((data) => setToken(data.secret))
                .catch((error) => {
                    console.log(error) 
                })
        } else {
            //handle empty data input here
        }
    }

    function keypress (event) {
        if (event.keyCode === 13) {
            login()
        }
    }

    return(
        <div className={classes.root}>
            <Image 
                className={classes.backgroundImage}
                fill
                src="/tree.jpg"
                alt="A big green tree"
            />
            <Paper elevation={3} className={classes.paper}>
                <Typography variant="h5" className={classes.bigBottomMargin} >User Login</Typography>
                <FormControl fullWidth className={classes.margin} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-email"
                        value={user.email}
                        label='Email'
                        onChange={(event) => setUser({...user, email: event.target.value})}
                        startAdornment={<InputAdornment position="start">
                            <MailOutlineIcon />
                        </InputAdornment>}
                    />
                </FormControl>
                <FormControl fullWidth className={classes.margin} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={user.showPassword ? 'text' : 'password'}
                        value={user.password}
                        onChange={(event) => setUser({...user, password: event.target.value})}
                        onKeyDown={keypress}
                        label='Password'
                        startAdornment={
                            <InputAdornment position="start">
                                <LockOpenIcon />
                            </InputAdornment>
                            }
                        endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={(event) => setUser({...user, showPassword: !user.showPassword})}
                                onMouseDown={(event) => event.preventDefault()}
                                edge="end"
                              >
                                {user.showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          }
                    />
                </FormControl>
                {showRegister?
                    <React.Fragment>
                    <FormControl fullWidth className={classes.margin} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-name">Name</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-name"
                            value={user.name}
                            label='Name'
                            onChange={(event) => setUser({...user, name: event.target.value})}
                            startAdornment={<InputAdornment position="start">
                                <AccountCircleIcon />
                            </InputAdornment>}
                        />
                    </FormControl>
                    <Button 
                            className={classes.margin} 
                            variant="contained" 
                            color="secondary" 
                            fullWidth
                            onClick={register}
                        >
                        Cancel
                    </Button>
                    <Button 
                            className={classes.margin} 
                            variant="contained" 
                            color="primary" 
                            fullWidth
                            onClick={newUser}
                        >
                        Submit
                    </Button>
                    </React.Fragment> 
                    : 
                    <React.Fragment>
                        <Button 
                            className={classes.margin} 
                            variant="contained" 
                            color="primary" 
                            fullWidth
                            onClick={login}
                            disabled={textForLoginButton === 'Loading...'}
                        >
                            {textForLoginButton}
                        </Button>
                        <hr className={classes.line}/>
                        <Button 
                            className={classes.margin} 
                            variant="contained" 
                            color="secondary" 
                            fullWidth
                            onClick={register}
                        >
                            Register
                        </Button>
                    </React.Fragment>
                }
                
            </Paper>
        </div>
    )
}