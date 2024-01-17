import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { bugsListByProject } from '../../faunaFunctions/client';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function Bugs ({token, projectsList, user}){

    const [bugsList, setBugsList] = useState([])


    useEffect(() => {
        var finalArray = []

        async function fetchBugsList(projectID, projectName){
            const returned = await bugsListByProject(token, projectID)
            //Need to make the date human readable and add the project name (rather than just an id).
            const result = returned.map(item => {return({...item, project: projectName, created: (new Date(item.created)).toLocaleDateString()})})
            finalArray = finalArray.concat(result)
            setBugsList(finalArray)
        }

        projectsList.forEach( (project)=> {
            fetchBugsList(project.id, project.name)
        });

    }, [])

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
  
  const handleAddNewFilter = () => {
    console.log("Click New Chip")
  }

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
      <Button variant="outlined" startIcon='+'>
        Add Bug
      </Button>
      </ListItem>
      <BugTable bugList={bugsList} filters={chipData} user={user.name}/>
    </Paper>
  );
}

function BugTable({bugList, filters, user}) {

    const whatColor = (type) => {
        const color = {green: 'success', orange: 'warning', red: 'error'}
        switch (type) {
            case 'Open':
                return(color.red)
            case 'In Progress':
                return(color.orange)
            case 'Closed':
                return(color.green)
            default:
                return('primary')
        }
    }

    const shouldBeIncluded = (row) => {
      /*
    { key: 0, label: 'Open', active: true},
    { key: 1, label: 'In Progress', active: true },
    { key: 2, label: 'Closed', active: true },
    { key: 3, label: '< 30 days', active: false},
    { key: 4, label: 'Mine', active: false },
    { key: 5, label: 'Project', active: false },
    */
      //compare each row in filters to see if the content should not be displayed, return true to not display an item.
      //could do some joined together boolean logic statements but I think this is easier to read.

      if (filters[3].active && ((new Date() - new Date(row.created)) > 2592000000)) return false //Filter 4 is within 30 days (2592000000ms)
      
      if (filters[4].active && user != row.owner) return false //Filter 4 is owner of project is current user

      if (filters[0].active && row.status === filters[0].label) return true //Filter 0 is Open projects
      if (filters[1].active && row.status === filters[1].label) return true //Filter 1 is In Progress projects
      if (filters[2].active && row.status === filters[2].label) return true //Filter 2 is Closed projects

      
      
      return false
    }

    return(
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="simple table">
        <TableHead>
            <TableRow>
            <TableCell>Bug Title</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="right">Owner</TableCell>
            <TableCell align="left">Project</TableCell>
            <TableCell align="right">Created</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {bugList.map((row) => 
              shouldBeIncluded(row) ?
                <Tooltip key={row.title} title={row.description} placement="left">
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                    <TableCell component="th" scope="row">{row.title}</TableCell>
                    <TableCell align="left">
                        <Chip 
                            label={row.status}
                            color={whatColor(row.status)}
                        />
                    </TableCell>
                    <TableCell align="right">{row.owner}</TableCell>
                    <TableCell align="left">{row.project}</TableCell>
                    <TableCell align="right">{row.created}</TableCell>
                    
                </TableRow>
                </Tooltip> 
                : null
              )}
        </TableBody>
        </Table>
        </TableContainer>
    )
}