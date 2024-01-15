import { makeStyles } from '@mui/styles';
import { useState, useEffect } from 'react';
import ProjectCard from './projectCard';
import { Typography } from '@mui/material';
import { projectList } from '../../faunaFunctions/client';
import { ChangeProjectDialog } from './projectCard';
import { TrendingUp } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
    container:{
        paddingTop: theme.spacing(2),
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        gap: '10px 20px',
    },
    card:{
        width: '350px',
        height: 'auto',
        borderStyle: 'dashed',
        borderColor: theme.palette.primary.main,
        borderRadius: '10px',
        color: theme.palette.primary.main,
        textAlign: 'center',
        paddingTop: '2%',
        cursor: 'pointer',
    }
}))

export default function Projects ({token}) {

    const [projects, setProjects] = useState([])
    const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false)
    const [updateProjects, setUpdateProjects] = useState(1) //Need a way to force a refresh from the server.

    useEffect(() => {
        projectList(token).then((returnedProjects) => {
            setProjects(returnedProjects.data)
        })
    }, [updateProjects])

    //Function to be triggered if user changes the name or description, or adds a new project, of an individual project and this needs to be sync'd to local props.
    const updateProjectsProp = (newName, newDescription, id) => {
        setUpdateProjects(updateProjects + 1) //Changing updateProjects should trigger the useEffect to reload info from database. There must be a better way of doing this.
    }
    

    const classes = useStyles()

    return(
        <div className={classes.container} >
            <AddNewProject token={token} setIsNewProjectDialogOpen={setIsNewProjectDialogOpen}/>
            <ChangeProjectDialog  
                name="" 
                description="" 
                isOpen={isNewProjectDialogOpen} 
                setIsOpen={setIsNewProjectDialogOpen} 
                token={token}
                updateProjectsProp={updateProjectsProp}
                isProjectNew={true}
            />
            {
                projects.map((project) => <ProjectCard key={project.id} id={project.id} projectName={project.name} projectDescription={project.description} token={token} updateProjectsProp={updateProjectsProp}/>)
            }
        </div>
    )
}

function AddNewProject ({setIsNewProjectDialogOpen}) {

    const classes = useStyles()

    const addNew = () => {
        setIsNewProjectDialogOpen(true)
    }

    return (
        <div className={classes.card} onClick={addNew}>
            <Typography variant="h1" component="p">+</Typography>
        </div>
    )
}