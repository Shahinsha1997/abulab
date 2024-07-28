import * as React from 'react';
import formWrapper from './FormDrawerWrapper';
import { Container, Grid, FormControlLabel, Switch, TextField, Box, Typography, Checkbox, Alert} from '@mui/material';
import { useSelector } from 'react-redux';
import { getProfiles, getUsers } from '../selectors/moduleselectors';
import { getPermissionObj } from '../utils/utils';
const UserForm = ({
    setFormObj,
    id
}) => {
const users = useSelector(getUsers);
const [formObj, setDeptFormObj] = React.useState(id == 'add' ? {} : users[id])
const handleInput = (e, value)=>{
    const { id, value:val, type } = e.target;
    setDeptFormObj({...formObj, [id]:type == 'checkbox' ? !value : val})
}

const { name, userName, password, maxSessionLimit, maxSessionTime, isDisabled } = formObj;
return (
    <Container maxWidth="sm">
        <Grid container spacing={2} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Grid item sx={{padding:'10px'}}>
            <TextField
                  id="name"
                  label="Name"
                  variant="outlined"
                  autoComplete="off"
                  placeholder={"Enter the Name"}
                  onChange={handleInput}
                  value={name}
                  fullWidth
                />
            </Grid>
            <Grid item>
                <TextField
                    id="userName"
                    label="User Name"
                    variant="outlined"
                    autoComplete="off"
                    placeholder={"Enter the User Name"}
                    onChange={handleInput}
                    value={userName}
                    fullWidth
                />
            </Grid>
            <Grid item>
                <TextField
                    id="password"
                    label="Password"
                    variant="outlined"
                    autoComplete="off"
                    placeholder={"Enter the Password"}
                    onChange={handleInput}
                    value={password}
                    fullWidth
                />
            </Grid>
            <Grid item>
                <TextField
                    id="maxSessionLimit"
                    label="Max Session Limit (count)"
                    variant="outlined"
                    autoComplete="off"
                    placeholder={"Enter the Max Session Limit"}
                    onChange={handleInput}
                    value={maxSessionLimit}
                    fullWidth
                />
            </Grid>
            <Grid item>
                <TextField
                    id="maxSessionTime"
                    label="Max Session Time (Hrs)"
                    variant="outlined"
                    autoComplete="off"
                    placeholder={"Enter the Max Session Time"}
                    onChange={handleInput}
                    value={maxSessionTime}
                    fullWidth
                />
            </Grid>
            <Grid item>
                <FormControlLabel labelPlacement="start" control={<Switch edge="end" id="isDisabled" checked={!isDisabled} onChange={handleInput} />} label="User Enabled" />
                {isDisabled && <Alert severity="info">{`${name} can't able to login anymore... `}</Alert>}
            </Grid>
        </Grid>
    </Container>
  );
}

export default formWrapper(UserForm);