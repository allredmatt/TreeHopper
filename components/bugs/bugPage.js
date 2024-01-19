import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import BugTable from './bugTable';
import { bugsListByProject, modifyBug } from '../../faunaFunctions/client';
import { Typography, Box } from '@mui/material';
import BugDialog from './bugDialog';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function Bugs ({token, projectsList, user }){

    const [bugsList, setBugsList] = useState([])
    const [resetBugsList, setResetBugsList] = useState(0)
    const [modifyBugData, setModifyBugData] = useState({
      isOpen: false, isNew: true,  projectId: projectsList[0].id, bugId: "", title: "", description: "", status: "Open"
    })


    useEffect(() => {
        var finalArray = []

        async function fetchBugsList(projectID, projectName){
            const returned = await bugsListByProject(token, projectID)
            //Need to make the date human readable and add the project name (rather than just an id).
            const result = returned.map(item => {return({...item, project: projectName, projectId: projectID, created: (new Date(item.created)).toLocaleDateString()})})
            finalArray = finalArray.concat(result)
            setBugsList(finalArray)
        }

        projectsList.forEach( (project)=> {
            fetchBugsList(project.id, project.name)
        });

    }, [resetBugsList])

  const [chipData, setChipData] = useState([
    { key: 0, label: 'Open', active: true},
    { key: 1, label: 'In Progress', active: true },
    { key: 2, label: 'Closed', active: true },
    { key: 3, label: '< 30 Days', active: false},
    { key: 4, label: 'Mine', active: false },
  ]); //Should add in filter by project in the future.

  const handleDelete = (chipToToggle) => () => {
    setChipData((chips) => chips.map((chip) => chip.key !== chipToToggle.key ? chip : {...chip, active: !chipToToggle.active}));
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 0.5,
        m: 0,
      }}
      component="ul"
      elevation={0}
    >
      <Typography variant="h5" sx={{marginBottom: 2, color: 'primary.main'}}>All Bugs</Typography>
      <Box sx={{ flexBasis: '100%', height: '0' }} /> {/*Added to force the chips onto a new line and have the text stay on top and be centre aligned*/}
      {chipData.map((data) => {
        return (
          data.active && <ListItem key={data.key}>
            <Chip
              label={data.label}
              onDelete={handleDelete(data)}
              color="primary"
            />
          </ListItem>
        );
      })}
      {chipData.map((data) => {
        return (
          !data.active && <ListItem key={data.key}>
            <Chip
              label={data.label}
              onClick={handleDelete(data)}
              clickable
              color="primary"
              variant="outlined"
            />
          </ListItem>
        );
      })}
      <ListItem key={'New'}sx={{marginLeft: 'auto'}}>
      <Button variant="outlined" startIcon='+' onClick={() => setModifyBugData({...modifyBugData, isOpen: true})}>
        Add Bug
      </Button>
      </ListItem>
      <BugTable bugList={bugsList} filters={chipData} user={user.name} setModifyBugData={setModifyBugData}/>
      <BugDialog 
        bugData = {modifyBugData}
        setBugData = {setModifyBugData}
        token = {token}
        resetBugsList = {resetBugsList}
        setResetBugsList = {setResetBugsList}
        projectsList = {projectsList}
      />
    </Paper>
  );
}

