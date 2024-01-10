import { makeStyles }           from '@material-ui/core/styles';
import Hidden                   from '@material-ui/core/Hidden';
import Fab                      from '@material-ui/core/Fab';
import BugReportIcon            from '@material-ui/icons/BugReport';
import PeopleIcon               from '@material-ui/icons/People';
import DescriptionIcon          from '@material-ui/icons/Description';
import Paper                    from '@material-ui/core/Paper';

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