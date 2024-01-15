import Hidden from '@mui/material/Hidden';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import BugReportIcon from '@mui/icons-material/BugReport';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { PeopleAlt, Nature } from '@mui/icons-material';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';

const useStyles = makeStyles((theme) => ({
    
    list: {
        width: theme.sizes.drawWidth,
        background: theme.palette.primary.main,
        color: '#ffffff',

    },
    typeMargin: {
        margin: theme.spacing(3),
    },
    indent:{
        paddingLeft: theme.spacing(4)
    },
    backDiv:{
        marginTop: theme.spacing(1.5),
        background: theme.palette.primary.main,
        color: '#ffffff',
        borderRadius: '0px 25px 25px 0px',
        height: 'calc(100% - ' + theme.spacing(1.5) + 'px)',
        width: theme.sizes.drawWidth, 
    },
    smallBackDiv:{
        background: theme.palette.primary.main,
        paddingLeft: theme.spacing(0.5),
        color: '#ffffff',
        borderRadius: '0px 25px 25px 0px',
        height: '300px',
        width: '60px',
    },
    buttonMargin:{
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(3),
        marginBottom: theme.spacing(2)
    },
    padding: {
        padding: theme.spacing(1)
    },
    topBox: {
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(3),
        paddingLeft: theme.spacing(0.5),
        display: 'flex',
        alignContent: 'centre',
        color: '#4B3E52',
    },
    listBox:{
        display: 'flex',
        alignContent: 'centre',
        paddingLeft: theme.spacing(1),
    },
    margin:{
        marginTop: theme.spacing(0.4)
    },
    titleText:{
        padding: theme.spacing(1),
        borderRadius: '10px',
        backgroundColor: '#4B3E52',
        color: '#ffffff',
    },
    container:{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
    },
    buttonBase:{
        width: '100%',
    }
  }));

export default function LeftBar ({setPageToRender}) {

    const classes = useStyles()

    const onButtonClick = (page) => {
        setPageToRender(page)
    }
 
    const DrawerContents = () => {
        return (
         <div className={classes.backDiv}>
            <Box className={classes.topBox} >
                <Typography className={classes.padding} >
                    <Nature fontSize='large'/>
                </Typography>
                <Typography variant='h5' className={classes.titleText}>
                    Treehopper
                </Typography>
            </Box>
            <List>
                <ListItem button onClick={() => onButtonClick('projects')}>
                    <ListItemIcon>
                        <ListAltIcon style={{ color: '#ffffff' }}/>
                    </ListItemIcon>
                    <ListItemText primary='Projects' />
            </ListItem>
            <ListItem button onClick={() => onButtonClick('bugs')}>
                    <ListItemIcon>
                        <BugReportIcon style={{ color: '#ffffff' }} />
                    </ListItemIcon>
                <ListItemText primary='Bugs' />
            </ListItem>
            <ListItem button onClick={() => onButtonClick('people')}>
                    <ListItemIcon>
                        <PeopleAlt style={{ color: '#ffffff' }} />
                    </ListItemIcon>
                <ListItemText primary='People' />
            </ListItem>
            </List> 
         </div>
         )
     }

    const SmallDrawerContents = () => {
       return (
        <div className={classes.container}>
            <div className={classes.smallBackDiv}>
            <Box className={classes.topBox}>
                <Typography >
                    <Nature fontSize='large'/>
                </Typography>
            </Box>
            <IconButton aria-label="Projects" onClick={() => onButtonClick('projects')}>
                    <ListAltIcon  style={{ color: '#ffffff' }}/>
            </IconButton> 
            <IconButton aria-label="Bugs" onClick={() => onButtonClick('bugs')}>
                    <BugReportIcon style={{ color: '#ffffff' }} />
            </IconButton>
            <IconButton aria-label="People" onClick={() => onButtonClick('people')}>
                    <PeopleAlt style={{ color: '#ffffff' }} />
            </IconButton>
            </div>
        </div>
        )
    }

    return (
        <nav aria-label="list of all projects">
            <Hidden smUp>
                <SmallDrawerContents />
            </Hidden>
            <Hidden only={"xs"}>
                <DrawerContents />
            </Hidden>
        </nav>
    )
}