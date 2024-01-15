import { makeStyles }           from '@mui/styles';
import Hidden                   from '@mui/material/Hidden';
import Fab                      from '@mui/material/Fab';
import BugReportIcon            from '@mui/icons-material/BugReport';
import PeopleIcon               from '@mui/icons-materialPeople';
import DescriptionIcon          from '@mui/icons-materialDescription';
import Paper                    from '@mui/material/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: theme.spacing(2),
    },
  }));
  
export default function BottomFAB ({setIsBugFormOpen}) {
    
    const classes = useStyles()
    
    return(
        <footer className={classes.root}>
            <Fab 
                color="secondary" 
                aria-label="Add new bug"
                onClick={() => setIsBugFormOpen(true)}
            >
                <BugReportIcon />
            </Fab> 
        </footer>
    )
}