import React, { useState } from 'react';
import formWrapper from './FormDrawerWrapper';
import { Container, Grid, FormControlLabel, Switch, TextField, Box, Typography, Checkbox, Button, Alert} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getProfiles } from '../selectors/moduleselectors';
import { getPermissionObj } from '../utils/utils';
import { addProfileAPI, updateProfileAPI } from '../actions/APIActions';
import { getDatas, showAlert } from '../dispatcher/action';
const ProfileForm = ({
    setFormObj,
    id
}) => {
const profiles = useSelector(getProfiles);
const handleInput = (e, value)=>{
    const { id, value:val, type } = e.target;
    setDeptFormObj({...formObj, [id]:type == 'checkbox' ? value : val})
}
const dispatch = useDispatch();
const permissionArr = [
    'viewAdminPanel',
    'viewOrg','addOrg','editOrg','deleteOrg',
    'viewProfile','addProfile','editProfile','deleteProfile',
    'viewDept','addDept','editDept','deleteDept',
    'viewUser','addUser','editUser','deleteUser',
    'viewStock','addStock','editStock','deleteStock',
    'viewSale','addSale','editSale','deleteSale'
];
const initalFormObj = {
    'profileName': '', 
    
}
permissionArr.map(permission=>{
    initalFormObj[permission] = false
})
const [formObj, setDeptFormObj] = React.useState(id == 'add' ? initalFormObj : {...profiles[id], ...profiles[id].permissions})
const [errFormObj, setErrFormObj] = useState({})
const { profileName:profileNameErr } = errFormObj;
const submitForm = () =>{
    const errObj = {};
    let isErrorFound = false;
    const fields  = ['profileName'];
    fields.map(field=>{
        if(['profileName'].includes(field) && formObj[field] == ''){
            isErrorFound = true;
            errObj[field] = `can't be empty`
        }
    })
    if(isErrorFound){
        return setErrFormObj(errObj);
    }
    const payload = {
        profileName: formObj.profileName
    }
    const permissions = permissionArr.map(permission=>formObj[permission] == true ? 1 : 0).join('');
    payload.permissions=permissions
    const profileAPI = id == 'add' ? addProfileAPI : updateProfileAPI;
    profileAPI(payload).then(res=>{
        dispatch(getDatas({module:'profiles',res}));
        setFormObj("profiles", res.id);
        dispatch(showAlert({type:'success', message:`Profile ${id == 'add' ? 'added' : 'updated' } successfully`}))
    }).catch(err=>{
        dispatch(showAlert({type:'error', message:err.message}))
    })
}
const { profileName } = formObj;
return (
    <Container maxWidth="sm">
        <Grid container spacing={2} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Grid item sx={{padding:'10px'}}>
            <TextField
                  id="profileName"
                  label="Profile Name"
                  variant="outlined"
                  autoComplete="off"
                  placeholder={"Enter the Profile Name"}
                  onChange={handleInput}
                  value={profileName}
                  fullWidth
                />
                {profileNameErr && <Alert severity="error">Profile Name {profileNameErr}</Alert>}
            </Grid>
            <Grid item>
                {getPermissionObj().map(moduleObj=>{
                    const { permissions, permissionNames, id, name } = moduleObj;
                return (
                    <>
                    <Typography variant="overline" sx={{fontSize:'1rem'}}>{name}</Typography>
                    <Grid container sx={{display:'flex', flexDirection:'column', ml:2}} >
                        {permissionNames.map((permissionName,index)=>(
                            <Grid item>
                                <FormControlLabel
                                    control={<Checkbox id={permissions[index]} checked={formObj[permissions[index]]} onChange={handleInput} />}
                                    label={permissionName}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    </>
                )
                }
            )}
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

export default formWrapper(ProfileForm);