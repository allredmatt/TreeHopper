import { useEffect, useState } from "react"
import LeftBar from './LeftBar'
import { getCurrentUsersName } from '../faunaFunctions/client'
import Projects from '../components/projects/projectPage'
import Bugs from '../components/bugs/bugPage'
import People from '../components/people/peoplePage'
import { makeStyles } from '@mui/styles';
import { projectList } from '../faunaFunctions/client';

const useStyles = makeStyles((theme) => ({
    root:{
        display: 'flex',
        width: "100%",
        height: "100vh",
        marginTop: theme.spacing(-1),
        paddingRight: theme.spacing(2),        
        overflowX: 'hidden',
        backgroundColor: theme.palette.lightGreen
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
        overflowX: 'scroll'
    },
}))

export default function AuthedApp ({token}) {

    const classes = useStyles()

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


    const [projects, setProjects] = useState([]) //State to store projects list from the DB
    const [updateProjects, setUpdateProjects] = useState(1) //Need a way to force a refresh from the server.

    //useEffect to load the list of projects from the DB
    useEffect(() => {
        projectList(token).then((returnedProjects) => {
            setProjects(returnedProjects.data)
        })
    }, [updateProjects])



    const whichPageToRender = (page) => {
        switch (page) {
            case 'projects':
                return(
                    <Projects 
                        token={token}
                        projects={projects}
                        setProjects={setProjects}
                        updateProjects={updateProjects}
                        setUpdateProjects={setUpdateProjects}
                    />)
            case 'bugs':
                return(<Bugs token={token} projectsList={projects} user={user}/>)
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
                {whichPageToRender(pageToRender)}
            </div>
        </div>
    )
}