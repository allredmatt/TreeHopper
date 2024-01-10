import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react'
import { bugsList, modifyBug } from '../faunaFunctions/client'
import { Toolbar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    bugDiv:{
        padding: theme.spacing(2),
    },
  }));

export default function MainArea ({token, selectedProject, user}) {

    const classes = useStyles()

    const [localBugsList, setLocalBugsList] = useState()

    useEffect(() => {
        //Populate localBugList with bugs from selected project
        if(selectedProject){
            bugsList(token, selectedProject.id)
            .then((data) => setLocalBugsList(data))
        }
    }, [selectedProject])

    const updateBugDB = (index, dataObject) => {
        //function to save local changes to DB
        const currentBug = localBugsList[index]

        //If function has been passed an object for data then use this to update bug. Otherwise save current state to DB
        if (dataObject) {
            modifyBug(token, currentBug.id, dataObject.title, dataObject.description, dataObject.status, dataObject.owner? dataObject.owner : null)
        } else {
             modifyBug(token, currentBug.id, currentBug.title, currentBug.description, currentBug.status, currentBug.owner? currentBug.owner : null)
            }
    }

    const updateBugState = (index, newData) => {
        //update state - use map to ignore other bugs and only update index 
        setLocalBugsList(localBugsList.map((bug, mapIndex) => index === mapIndex ? {...newData} : bug))
    }

    if(selectedProject){ 
    return (
        <div>
            <Toolbar />
            <div className={classes.bugDiv}>
                {localBugsList?.map((bug, index) => 
                <BugCard 
                    key={bug.title}
                    currentProject={selectedProject.name}
                    title={bug.title}
                    status={bug.status}
                    owner={bug.owner ? bug.owner : null}
                    description={bug.description}
                    updateBugDB={(dataObject = null) => updateBugDB(index, dataObject)}
                    setBugsList={(newData) => updateBugState(index, newData)}
                    user={user}
                />)}
            </div>
        </div>
    )
    } else {
        return (
            null
        )
    }
}

