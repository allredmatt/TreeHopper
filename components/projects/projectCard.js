import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { Fragment } from 'react';
import {updateProjectName, addUserToProject, removeUserFromProject, newProject} from '../../faunaFunctions/client';
import { userList, teamMembersList } from '../../faunaFunctions/client';

import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';

const useStyles = makeStyles((theme) => ({
    card:{
        width: '350px',
    },
    padLeft:{
        paddingLeft: theme.spacing(1)
    },
    avatarBlue: {
      backgroundColor: '#89CFF0',
      color: '#0096FF',
    },
    avatarGreen: {
      backgroundColor: '#9FE2BF',
      color: '#00A36C',
    }
}))

export default function ProjectCard ({id, projectName, projectDescription, token, updateProjectsProp}) {

    const classes = useStyles()
    const [openForm, setOpenForm] = useState(false)
    const [openAddUsers, setOpenAddUsers] = useState(false)

    return(
        <Fragment>
        <ChangeProjectDialog 
          id={id} 
          name={projectName} 
          description={projectDescription} 
          isOpen={openForm} 
          setIsOpen={setOpenForm} 
          token={token} 
          updateProjectsProp={updateProjectsProp}
          isProjectNew={false}
        />
        <AddPeopleDialog
          id={id}
          open={openAddUsers}
          setOpen={setOpenAddUsers}
          token={token}
        />
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="h6" color='textPrimary' >{projectName}</Typography>
                <Typography variant="body1">{projectDescription}</Typography>
            </CardContent>
            <CardActions >
                <Button size="small" color="secondary" className={classes.padLeft} onClick={()=> setOpenForm(true)}>
                    Change Details
                </Button>
                <Button size="small" color="secondary" onClick={()=> setOpenAddUsers(true)}>
                    Assign People
                </Button>
            </CardActions>
        </Card>
        </Fragment>
    )
}

export function ChangeProjectDialog ({id, name, description, isOpen = false, setIsOpen, token, updateProjectsProp, isProjectNew }) {

    const [newName, setNewName] = useState(name)
    const [newDescription, setNewDescription] = useState(description)
    const [isDisabled, setIsDisabled] = useState(false)

    const handleSave = () => {
      setIsDisabled(true)
      //Update the projects details on the database server
      if(isProjectNew){
        newProject (token, newName, newDescription).then(()=>{
          handleClose()
          //Update the local projects prop 
          updateProjectsProp(newName, newDescription, id)
        })
      } else {
        updateProjectName (token, id, newName, newDescription).then(()=>{
          handleClose()
          //Update the local projects prop 
          updateProjectsProp(newName, newDescription, id)
        })
      }
    }

    const handleClose = () => {
      setIsOpen(false)
      setNewName(name)
      setNewDescription(description)
      setIsDisabled(false)
    }

    return(
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle id="form-dialog-title">Change Details</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Project Name"
            defaultValue= {newName}
            onChange={(event)=>setNewName(event.target.value)}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Project description"
            multiline
            defaultValue= {newDescription}
            onChange={(event)=>setNewDescription(event.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} color="secondary" disabled={isDisabled}>
            {isDisabled? "Saving" : "Save"}
          </Button>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    )
}

function AddPeopleDialog ({ id, open, setOpen, token }) {

  const classes = useStyles()

  //Get from database a list of all users
  const [listOfUsers, setListOfUsers] = useState([{name: 'Loading', id: 1}])
  
  //Read current users as stored on the DB - Won't be modified by state in form etc... locally - only when uploaded to DB
  const [currentProjectUsers, setCurrentProjectUsers] = useState ([{name: 'Loading', id: 1}])

  //Need a copy of the list just for use in states and forms temporarily while users modify but before upload to database
  const [localCurrentProjectUsers, setLocalCurrentProjectUsers] = useState ([{name: 'Loading', id: 1}])

  useEffect(() => {
      userList(token).then((returned) => {
        setListOfUsers(returned)
      })
      teamMembersList(token, id).then((returned) => {
        setCurrentProjectUsers(returned.map(entry => entry.id))
        setLocalCurrentProjectUsers(returned.map(entry => entry.id))
      })
  }, [])

  const handleClose = () => {
    //Go through list of users who should be in the project and add them if they are not.
    localCurrentProjectUsers.forEach( (memberId) => {
      if(!currentProjectUsers.includes(memberId)) {
        console.log('Add member ' + memberId)
        //Code to add memberID to the Database
        addUserToProject(token, id, memberId)
      }
    }
    )
    
    //Go through list of members according to database and check to see if they have been removed.
    currentProjectUsers.forEach((memberId) => {
      if(!localCurrentProjectUsers.includes(memberId)) {
        console.log('Remove member ' + memberId)
        //Code to remove memberID from Database
        removeUserFromProject(token, id, memberId)
      }
    })

    //Update local state of current users to reflect new database info.
    setCurrentProjectUsers(localCurrentProjectUsers)

    setOpen(false)
  };

  const handleListItemClick = (value, id) => {
    localCurrentProjectUsers.includes(id) ?
    setLocalCurrentProjectUsers(localCurrentProjectUsers.filter(userId => userId != id)):
    setLocalCurrentProjectUsers(localCurrentProjectUsers.concat([id]))
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="add-people-dialog-title" open={open}>
      <DialogTitle id="add-people-dialog-title">Modify users working on this project.</DialogTitle>
      <List>
        {listOfUsers.map((userName) => (
          <ListItem button onClick={() => handleListItemClick(userName.name, userName.id)} key={userName.name}>
            <ListItemAvatar>
              {localCurrentProjectUsers.includes(userName.id) ? 
                <Avatar className={classes.avatarGreen}><CheckCircleIcon /></Avatar> : 
                <Avatar className={classes.avatarBlue}><PersonIcon /></Avatar>
              }
            </ListItemAvatar>
            <ListItemText primary={userName.name} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}