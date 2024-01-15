import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function Bugs ({token}){

    useEffect(() => {
        projectList(token).then((returnedProjects) => {
            setProjects(returnedProjects.data)
        })
    }, [updateProjects])

  const [chipData, setChipData] = useState([
    { key: 0, label: 'Open' },
    { key: 1, label: "Matt's" },
    { key: 2, label: 'Polymer' },
    { key: 3, label: 'React' },
    { key: 4, label: 'Vue.js' },
  ]);

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
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
          <ListItem key={data.key}>
            <Chip
              label={data.label}
              onDelete={handleDelete(data)}
              color="primary"
            />
          </ListItem>
        );
      })}
      <ListItem key={'Add'}>
            <Chip
              label='+'
              onClick={handleAddNewFilter}
              color="secondary"
              clickable
            />
      </ListItem>
      <ListItem key={'New'}sx={{marginLeft: 'auto'}}>
      <Button variant="outlined" startIcon='+'>
        Add Bug
      </Button>
      </ListItem>
      <BugTable />
    </Paper>
  );
}

function BugTable() {

    function createData(title, owner, date, status, project, description) {
        return { title, owner, date, status, project, description };
    }

    const rows = [
        createData('Title 1', 'Matt', '15/01/2023', 'Open', 'Test Project', 'Longer description about bug 1'),
        createData('Title 2', 'Matt', '15/01/2023', 'Open', 'Test Project', 'Longer description about bug 2'),
        createData('Title 3', 'Matt', '15/01/2023', 'Closed', 'Test Project', 'Longer description about bug 3'),
        createData('Title 4', 'Matt', '15/01/2023', 'In Progress', 'Test Project', 'Longer description about bug 4'),
        createData('Title 5', 'Matt', '15/01/2023', 'Open', 'Test Project', 'Longer description about bug 5'),
      ];

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

    return(
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
            <TableRow>
            <TableCell>Bug Title</TableCell>
            <TableCell align="right">Owner</TableCell>
            <TableCell align="right">Created</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Project</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {rows.map((row) => (
            <Tooltip key={row.title} title={row.description} placement="left">
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                <TableCell component="th" scope="row">
                    {row.title}
                </TableCell>
                <TableCell align="right">
                    {row.owner}
                 </TableCell>
                <TableCell align="right">{row.date}</TableCell>
                <TableCell align="right">
                    <Chip 
                        label={row.status}
                        color={whatColor(row.status)}
                    />
                </TableCell>
                <TableCell align="right">{row.project}</TableCell>
            </TableRow>
            </Tooltip>
            ))}
        </TableBody>
        </Table>
        </TableContainer>
    )
}