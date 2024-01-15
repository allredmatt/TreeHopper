import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import GitHubIcon from '@mui/icons-material/GitHub';
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