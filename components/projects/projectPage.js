import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import ProjectCard from './projectCard';
import { Typography } from '@material-ui/core';
import { projectList } from '../../faunaFunctions/client';
import { ChangeProjectDialog } from './projectCard';

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
    useEffect(() => {
        projectList(token).then((returnedProjects) => {
            setProjects(returnedProjects.data)
        })
    }, [])

    //Function to be triggered if user changes the name or description of an individual project and this needs to be sync'd to local props.
    const updateProjectsProp = (newName, newDescription, id) => {
        setProjects(
            projects.map(project => {
                return {
                    //if ids match then change the name and title
                    name: project.id === id ? newName : project.name,
                    description: project.id === id ? newDescription : project.description,
                    id: project.id,
                };
            })
        )
    }
    

    const classes = useStyles()

    return(
        <div className={classes.container} >
            <AddNewProject />
            <ChangeProjectDialog key='new' name="Add new name here" description="Add a description of the project" isOpen={isNewProjectDialogOpen} setIsOpen={setIsNewProjectDialogOpen} />
            {
                projects.map((project) => <ProjectCard key={project.id} id={project.id} projectName={project.name} projectDescription={project.description} token={token} updateProjectsProp={updateProjectsProp}/>)
            }
        </div>
    )
}

function AddNewProject () {

    const classes = useStyles()

    const addNew = () => {
        console.log("New Project")
    }

    return (
        <div className={classes.card} onClick={addNew}>
            <Typography variant="h1" component="p">+</Typography>
        </div>
    )
}