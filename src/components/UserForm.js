import React, { useState, useEffect } from 'react';
import formWrapper from './FormDrawerWrapper';
import { Container, Grid, FormControlLabel, Switch, TextField, Box, Typography, Checkbox, Alert, InputAdornment, IconButton, Button, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getOrgArr, getOrgObj, getProfiles, getProfilesArr, getUsers } from '../selectors/moduleselectors';
import { getPermissionObj } from '../utils/utils';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { addUsersAPI, updateUsersAPI } from '../actions/APIActions';
import { getDatas, showAlert } from '../dispatcher/action';
const UserForm = ({
    setFormObj,
    id,
    setChildObj
}) => {
    const initalFormObj = {
        'name': '', 
        userName : '',
        password: '',
        maxSessionLimit: '',
        maxSessionTime: '',
        isDisabled:false,
        profileId:''
    }
    const dispatch = useDispatch();
    const users = useSelector(getUsers);
    const profilesList = useSelector(getProfilesArr)
    const [orgObj] = useSelector(getOrgArr)
    const [formObj, setUserFormObj] = useState(id == 'add' ? initalFormObj : users[id]);
    const [errFormObj, setErrFormObj] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const handleInput = (e, value)=>{
        const { name, value:val, type } = e.target;
        setUserFormObj({...formObj, [name]:type == 'checkbox' ? !value : val})
    }

    const { name, userName, password, maxSessionLimit, maxSessionTime, isDisabled, profileId, } = formObj;
    const { name:nameErr, userName:userNameErr, password:passwordErr, maxSessionLimit:maxSessionLimitErr, maxSessionTime:maxSessionTimeErr, profileId:profileIdErr } = errFormObj;
    const submitForm = () =>{
        const { maxSessionLimit: orgMaxSessionLimit, maxSessionTime:orgMaxSessionTime } = orgObj;
        const errObj = {};
        let isErrorFound = false;
        const fields  = ['name', 'userName', 'password', 'maxSessionLimit','maxSessionTime','isDisabled', 'profileId'];
        fields.map(field=>{
            if(['name','userName','password', 'profileId'].includes(field) && formObj[field] == ''){
                isErrorFound = true;
                errObj[field] = `can't be empty`
            }
        })
        if(orgMaxSessionLimit < maxSessionLimit){
            isErrorFound = true;
            errObj['maxSessionLimit'] = `You can't give Max Session Limit greater than ${orgMaxSessionLimit}`
        }
        if(orgMaxSessionTime < maxSessionTime){
            isErrorFound = true;
            errObj['maxSessionTime'] = `You can't give Max Session Time greater than ${orgMaxSessionTime}`
        }
        if(isErrorFound){
            return setErrFormObj(errObj);
        }
        const userAPI = id == 'add' ? addUsersAPI : updateUsersAPI 
        userAPI(formObj).then(res=>{
            dispatch(getDatas({module:'users',res}));
            setFormObj('users', res.id);
            dispatch(showAlert({type:'success', message:`User ${id == 'add' ? 'added' : 'updated' } successfully`}))
        }).catch(err=>{
            dispatch(showAlert({type:'error', message:err.message}))
        })
    }
    return (
        <Container maxWidth="sm">
            <Grid container spacing={2} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Grid item sx={{padding:'10px'}}>
                    <TextField
                        id="name"
                        label="Name"
                        name="name"
                        variant="outlined"
                        autoComplete="off"
                        placeholder={"Enter the Name"}
                        onChange={handleInput}
                        value={name}
                        fullWidth
                        />
                    {nameErr && <Alert severity="error">Name {nameErr}</Alert>}
                </Grid>
                <Grid item>
                    <TextField
                        id="userName"
                        label="User Name"
                        name="userName"
                        variant="outlined"
                        autoComplete="off"
                        placeholder={"Enter the User Name"}
                        onChange={handleInput}
                        value={userName}
                        fullWidth
                    />
                    {userNameErr && <Alert severity="error">User Name {userNameErr}</Alert>}
                </Grid>
                <Grid item>
                    <TextField
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        name="password"
                        variant="outlined"
                        autoComplete="off"
                        placeholder={"Enter the Password"}
                        onChange={handleInput}
                        value={password}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="Toggle password visibility"
                                onClick={()=>setShowPassword(!showPassword)}
                                edge="end"
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            )
                        }}
                    />
                    {passwordErr && <Alert severity="error">Password {passwordErr}</Alert>}        
                </Grid>
                <Grid item>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="profileId">Choose Profile</InputLabel>
                        <Select
                            labelId="profileId"
                            id="profileId"
                            name="profileId"
                            value={profileId}
                            onChange={handleInput}
                            label="Choose Profile"
                        >
                            {profilesList.map(profile=>
                                <MenuItem value={profile.id}>{profile.profileName}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    {profileIdErr && <Alert severity="error">Profile {profileIdErr}</Alert>} 
                </Grid>
                <Grid item>
                    <TextField
                        id="maxSessionLimit"
                        label="Max Session Limit (count)"
                        variant="outlined"
                        name="maxSessionLimit"
                        autoComplete="off"
                        placeholder={"Enter the Max Session Limit"}
                        onChange={handleInput}
                        value={maxSessionLimit}
                        fullWidth
                    />
                    {maxSessionLimitErr && <Alert severity="error">{maxSessionLimitErr}</Alert>}  
                </Grid>
                <Grid item>
                    <TextField
                        id="maxSessionTime"
                        label="Max Session Time (Hrs)"
                        variant="outlined"
                        name="maxSessionTime"
                        autoComplete="off"
                        placeholder={"Enter the Max Session Time"}
                        onChange={handleInput}
                        value={maxSessionTime}
                        fullWidth
                    />
                    {maxSessionTimeErr && <Alert severity="error">{maxSessionTimeErr}</Alert>} 
                </Grid>
                <Grid item>
                    <FormControlLabel labelPlacement="start" control={<Switch edge="end" name="isDisabled" id="isDisabled" checked={!isDisabled} onChange={handleInput} />} label="User Active" />
                    {isDisabled && <Alert severity="info">{`${name} can't able to login anymore... `}</Alert>}
                </Grid>
                <Grid item>
                    <Button variant="text" sx={{ color:'#0a2af2cf', padding:'10px', fontSize:'1rem', width: '100%', fontFamily:'bold' }} onClick={submitForm}>
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}

export default formWrapper(UserForm);