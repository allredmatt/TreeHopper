import { useState } from 'react'
import { Login }    from '../components/login'
import dynamic      from 'next/dynamic'
import { makeStyles } from '@material-ui/core/styles';

const AuthedApp = dynamic(() => import('../components/AuthedApp'))

export default function Home () {

    const [token, setToken] = useState()

    return (
        <div >
            {token? <AuthedApp token={token} /> : <Login setToken={setToken}/>}
        </div>
    )
}