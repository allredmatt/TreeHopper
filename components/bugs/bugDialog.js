import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { addBug, modifyBug} from '../../faunaFunctions/client'

export default function BugDialog (props) {
    /* Fauna database bug document example:
        data": {
            "title": "Bug title goes here",
            "description": "Just some info about what the bug is and where it appears.",
            "status": "In Progress",
            "project": Ref(Collection("Projects"), "284518301215752711"),
            "owner": "Matt",
            "created": Time(...)

        "created" and "owner" are added by the database on new bug being added

        addBug function in client has the following params:
            addBug (secret, projectId, title, description, status = "Open")

        modifyBug function in client has the following params:
            modifyBug (secret, bugId, title, description, status)

        props details: 
            bugData = {modifyBugData}
            setBugData = {setModifyBugData}
            token = {token}
            resetBugsList = {resetBugsList}
            setResetBugsList = {setResetBugsList}
    */
    const {bugData, setBugData, token, resetBugsList, setResetBugsList, projectsList} = props
    const {isOpen, isNew, projectId, bugId, title, description, status } = bugData

    const handleSave = () => {

        function reset () {
            //Give server time to update etc... then call resetBugsList
            setTimeout(() => setResetBugsList(resetBugsList + 1), 100)
        }

        isNew?
            addBug(token, projectId, title, description, status).then(reset) : 
            modifyBug(token, bugId, title, description, status).then(reset)
        handleClose()
    }
    
    const handleClose = () => {
        setBugData({
                                         //Select the first project in the list
            isOpen: false, isNew: true,  projectId: projectsList[0].id, bugId: "", title: "", description: "", status: "Open"
          })
    }

    return (
        <Dialog
        open={isOpen}
        onClose={handleClose}
        >
        <DialogTitle>{isNew? "Create new bug" : "Edit Bug Details"}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Please enter the details below:
            </DialogContentText>
            <TextField
                margin="normal"
                id="Title"
                name="Title"
                label="Title"
                fullWidth
                variant="outlined"
                value={bugData.title}
                onChange={(event) => setBugData({...bugData, title: event.target.value})}
            />
            <TextField
                margin="normal"
                id="Description"
                name="Description"
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={bugData.description}
                onChange={(event) => setBugData({...bugData, description: event.target.value})}
            />
            <Box component="form" sx={{
                    width: '100%',
                    marginTop: 2,
                    display: 'flex',
                    alignContent: 'space-between',
                    alignItems: 'stretch',
                    flexWrap: 'wrap',
                }}>
            <FormControl sx={{minWidth: '138px', marginRight: 2}}>
                <InputLabel id="select-status-label">Status</InputLabel>
                <Select
                    labelId="select-status-label"
                    id="select-status"
                    label="Status"
                    variant="outlined"
                    value={bugData.status}
                    onChange={(event) => setBugData({...bugData, status: event.target.value})}
                    >
                        <MenuItem key='0' value="Open"><Chip label='Open' color='error'/></MenuItem>
                        <MenuItem key='1' value="In Progress"><Chip label='In Progress' color='warning'/></MenuItem>
                        <MenuItem key='2' value="Closed"><Chip label='Closed' color='success'/></MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{flexGrow: '2'}}>
                <InputLabel id="select-project">Project</InputLabel>
                <Select
                    sx={{height: '100%'}}
                    labelId="select-project"
                    id="select-project"
                    label="Project"
                    variant="outlined"
                    value={bugData.projectId}
                    onChange={(event) => setBugData({...bugData, projectId: event.target.value})}
                    >
                        {
                            projectsList.map((project, index) =>
                                <MenuItem key={index} value={project.id}>{project.name}</MenuItem>
                            )
                        }
                </Select> 
            </FormControl>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
        </DialogActions>
        </Dialog>
    )
} 