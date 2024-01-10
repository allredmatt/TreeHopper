import React             from 'react';
import { useState }      from "react"
import { makeStyles }    from '@material-ui/core/styles';
import Paper             from '@material-ui/core/Paper';
import Typography        from '@material-ui/core/Typography';
import IconButton        from '@material-ui/core/IconButton';
import OutlinedInput     from '@material-ui/core/OutlinedInput';
import InputLabel        from '@material-ui/core/InputLabel';
import InputAdornment    from '@material-ui/core/InputAdornment';
import FormControl       from '@material-ui/core/FormControl';
import Visibility        from '@material-ui/icons/Visibility';
import VisibilityOff     from '@material-ui/icons/VisibilityOff';
import MailOutlineIcon   from '@material-ui/icons/MailOutline';
import LockOpenIcon      from '@material-ui/icons/LockOpen';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Button            from '@material-ui/core/Button';
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
                layout='fill'
                src="/tree.jpg"
                alt="A big green tree"
                objectFit="cover"
            />
            <Paper elevation={3} className={classes.paper}>
                <Typography variant="h5" className={classes.bigBottomMargin} >User Login</Typography>
                <FormControl fullWidth className={classes.margin} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-email"
                        value={user.email}
                        onChange={(event) => setUser({...user, email: event.target.value})}
                        startAdornment={<InputAdornment position="start">
                            <MailOutlineIcon />
                        </InputAdornment>}
                        labelWidth={45}
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
                        labelWidth={75}
                    />
                </FormControl>
                {showRegister?
                    <React.Fragment>
                    <FormControl fullWidth className={classes.margin} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-name">Name</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-name"
                            value={user.name}
                            onChange={(event) => setUser({...user, name: event.target.value})}
                            startAdornment={<InputAdornment position="start">
                                <AccountCircleIcon />
                            </InputAdornment>}
                            labelWidth={45}
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