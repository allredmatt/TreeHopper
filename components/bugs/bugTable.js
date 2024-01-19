import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { useState, Fragment } from 'react'
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import { Typography, Box } from '@mui/material';

export default function BugTable({bugList, filters, user, setModifyBugData}) {

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

    function Row({row}) {
      const [open, setOpen] = useState(false)
      return(
        <Fragment>
          <TableRow sx={{ '& > *': { borderBottom: 'unset' }}} >
              <TableCell><IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton></TableCell>
              <TableCell component="th" scope="row">{row.title}</TableCell>
              <TableCell align="center"> <Chip label={row.status} color={whatColor(row.status)}/> </TableCell>
              <TableCell align="left">{row.owner}</TableCell>
              <TableCell align="left">{row.project}</TableCell>
              <TableCell align="right">{row.created}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ 
                    margin: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}>
                  <Typography variant="body1" gutterBottom component="div" sx={{paddingTop: 1}}>
                    {row.description}
                  </Typography>
                  <Button 
                    color="secondary" 
                    sx={{marginLeft: 'auto'}} 
                    onClick={() => setModifyBugData({
                      isOpen: true,
                      isNew: false,
                      projectId: row.projectId, 
                      bugId: row.id, 
                      title: row.title, 
                      description: row.description, 
                      status: row.status
                  })}>Modify</Button>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </Fragment>
    )}

    return(
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="simple table">
        <TableHead>
            <TableRow>
            <TableCell />
            <TableCell>Bug Title</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="left">Owner</TableCell>
            <TableCell align="left">Project</TableCell>
            <TableCell align="right">Created</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {bugList.map((row, index) => 
              shouldBeIncluded(row) ?
                <Row key={index} row={row}/>
                : null
              )}
        </TableBody>
        </Table>
        </TableContainer>
    )
}