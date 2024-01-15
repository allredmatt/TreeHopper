import { useEffect, useState } from "react"
import LeftBar from './LeftBar'
import MainArea from './MainArea'
import { getCurrentUsersName } from '../faunaFunctions/client'
import Projects from '../components/projects/projectPage'
import Bugs from '../components/bugs/bugPage'
import People from '../components/people/peoplePage'
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root:{
        display: 'flex',
        width: "100%",
        height: "100vh",
        marginTop: theme.spacing(-1),
        paddingRight: theme.spacing(2),        
        overflowX: 'hidden',
    },
    responsivePadMain: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 'calc(100% - 200px)'
        },
        [theme.breakpoints.up('lg')]: {
            width: 'calc(100% - 200px - 190px)'
        },
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(2),
    },
}))

export default function AuthedApp ({token}) {

    const classes = useStyles()

    const [selectedProject, setSelectedProject] = useState()
    const [pageToRender, setPageToRender] = useState('projects')
    const [user, setUser] = useState({name: null, email: null})

    useEffect(() => {
        //Gather users name from database and change user state
        if(token) {
            getCurrentUsersName(token)
            .then((data) => setUser({...data}))
            .catch(error => console.log(error))
        }
    }, [token])

    const whichPageToRender = (page) => {
        switch (page) {
            case 'projects':
                return(<Projects token={token} />)
            case 'bugs':
                return(<Bugs token={token} />)
            case 'people':
                return(<People token={token} />)
            default:
                return null
        }
    }

    return (
        <div className={classes.root}>
            <LeftBar setPageToRender = {setPageToRender}/>
            <div className={classes.responsivePadMain}>
                <MainArea token={token} selectedProject={selectedProject} user={user}/>
                {whichPageToRender(pageToRender)}
            </div>
        </div>
    )
}