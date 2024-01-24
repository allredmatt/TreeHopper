import { useState } from 'react'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { changePassword, logout, modifyUserDetails } from '../../faunaFunctions/client'

export default function People ({token, user}) {

    const [localUserInfo, setLocalUserInfo] = useState(user)
    const [showPassword, setShowPassword] = useState(false)
    const [newPassword, setNewPassword] = useState('')

    const handleDetailsSave = () => {
        modifyUserDetails(token, localUserInfo.name, localUserInfo.email)
        //Need to reload data or update parent state of 'user'
    }

    const handleLogout = () => {
        logout(token)
        location.reload();
    }

    const handleChangePassword = () => {
        changePassword(token, newPassword)
    }

    return(
        <Paper
        sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            listStyle: 'none',
            p: 2,
            m: 0,
        }}
        >
            <Typography 
                variant="h5"
                sx={{width: '100%', mb: 2}}
            >
                Edit your personal details:
            </Typography>
            <TextField
                id="users-name"
                label="Name"
                margin="normal"
                value={localUserInfo.name}
                onChange={(event) => setLocalUserInfo({...localUserInfo, name: event.target.value})}
            />
            <TextField
                id="email-address"
                label="Email"
                margin="normal"
                value={localUserInfo.email}
                onChange={(event) => setLocalUserInfo({...localUserInfo, email: event.target.value})}
            />
            <Button onClick={handleDetailsSave} color='secondary'>
                Save
            </Button>
            <Divider flexItem sx={{width: '100%', mt: 1, mb: 1}}/>
            <FormControl sx={{ mt: 1, mb: 1, width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="password-change">New Password</InputLabel>
                <OutlinedInput
                    id="password-change"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    }
                    label="New Password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                />
            </FormControl>
            <Button onClick={handleChangePassword} color='secondary'>
                Change
            </Button>
            <Divider flexItem sx={{width: '100%', marginTop: 1, marginBottom: 1}}/>
            <Button onClick={handleLogout}>Log out</Button>
        </Paper>
    )
}