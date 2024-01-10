import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import GitHubIcon from '@material-ui/icons/GitHub';
import { useReducer, useRef } from 'react';

const useStyles = makeStyles((theme) => ({
    card:{
        width: 320,
    },
    controlArea:{
        display: 'flex',
    },
    infoArea:{
        height: '100%'
    },
    rightAlign:{
        marginLeft: "auto"
    },
    warningColour:{
        color: theme.palette.warning.dark
    },
    bugClosedColour:{
        color: theme.palette.success.dark
    }
  }));

export default function BugCard ({currentProject, title, status, description, owner, bugLink, setBugsList, updateBugDB, user}) {
    const classes = useStyles();

    const setOwner = () => {

        let dataObject = {
            title: title, 
            status: status, 
            description: description,
            status: 'InProgress',
            owner: user.name
        }

        setBugsList(dataObject)

        updateBugDB(dataObject)
    }

    const statusIcon = (status) => {
        switch(status){
            case "Open":
                return(
                    <div className={classes.controlArea}>
                    <CardActions className={classes.rightAlign}>
                        <Button size="small" onClick={setOwner}>
                            I'm going to fix this
                        </Button>
                        <Tooltip title={`Status is ${status}`} aria-label={`Status is ${status}`}>
                            <AssignmentLateIcon color="error"/>
                        </Tooltip>
                    </CardActions>
                    </div>
                    )
            case "Closed":
                return(
                    <div className={classes.controlArea}>
                    <CardActions className={classes.rightAlign}>
                        <Typography variant="body2">
                            Closed by {owner ? owner : 'Unknown'}
                        </Typography>
                        {bugLink? 
                        <Link href={bugLink}>
                            <GitHubIcon color="secondary"/>
                        </Link>
                        : null
                        }
                        <Tooltip title={`Status is ${status}`} aria-label={`Status is ${status}`}>
                            <AssignmentTurnedInIcon className={classes.bugClosedColour}/>
                        </Tooltip>
                    </CardActions>
                    </div>
                
                )
            case "InProgress":
                return(
                    <div className={classes.controlArea}>
                    <CardActions className={classes.rightAlign}>
                        <Typography variant="body2">
                            Been worked on by {owner ? owner : 'Unknown'}
                        </Typography>
                        {bugLink? 
                        <Link href={bugLink}>
                            <GitHubIcon color="secondary"/>
                        </Link>
                        : null
                        }
                        <Tooltip title={`Status is ${status}`} aria-label={`Status is ${status}`}>
                            <AssignmentIndIcon className={classes.warningColour}/>
                        </Tooltip>
                    </CardActions>
                    </div>
                
                )
            default: 
            return (<AssignmentIndIcon className={classes.warningColour}/>)
        }
    }

    return (
        <Card className={classes.card}>
            <CardContent className={classes.infoArea}>
                <Typography variant="h5" gutterBottom>
                {title}
                </Typography>
                <Typography variant="body2" component="p">
                {description}
                </Typography>
            </CardContent>
            <Divider variant="middle"/>
            {statusIcon(status)}
        </Card>
    )
}