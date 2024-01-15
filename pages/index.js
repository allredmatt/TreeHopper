import { useState } from 'react'
import { Login }    from '../components/login'
import dynamic      from 'next/dynamic'
import { makeStyles } from '@mui/styles';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../components/theme';


const AuthedApp = dynamic(() => import('../components/AuthedApp'))

export default function Home () {

    const [token, setToken] = useState()

    return (
        <div >
            <ThemeProvider theme={theme}>
                {token? <AuthedApp token={token} /> : <Login setToken={setToken}/>}
            </ThemeProvider>
        </div>
    )
}