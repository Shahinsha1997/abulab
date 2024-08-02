import React, { useState } from 'react';
import formWrapper from './FormDrawerWrapper';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, TextField, IconButton, InputAdornment, Autocomplete, Container, Grid, List, ListItem, ListItemText, ListItemIcon, LinearProgress, ListItemButton, FormControlLabel, Switch} from '@mui/material';
import { CalendarTodayOutlined, ScheduleOutlined, AccountBalanceWalletOutlined, MoneyOffOutlined, StarBorderOutlined } from '@mui/icons-material'; // Import icons
import { PersonOutlineOutlined, AccountTreeSharp, GroupAddOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartments, getProfilesArr } from '../selectors/moduleselectors';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { addDepartmentAPI, updateDepartmentAPI } from '../actions/APIActions';
import { getDatas, showAlert } from '../dispatcher/action';
const DepartmentForm = ({
    setFormObj,
    id
}) => {
    const initalFormObj = {
        deptName:'',
        isDisabled: false
    }
const departments = useSelector(getDepartments);
const dispatch = useDispatch();
const [formObj, setDeptFormObj] = useState(id == 'add' ? initalFormObj : departments[id])
const [errFormObj, setErrFormObj] = useState({})
const handleInput = (e, value)=>{
    const { id, value:val, type } = e.target;
    setDeptFormObj({...formObj, [id]:type == 'checkbox' ? !value : val})
}
const submitForm = () =>{
    const errObj = {};
    let isErrorFound = false;
    const fields  = ['deptName'];
    fields.map(field=>{
        if(['deptName'].includes(field) && formObj[field] == ''){
            isErrorFound = true;
            errObj[field] = `can't be empty`
        }
    })
    if(isErrorFound){
        return setErrFormObj(errObj);
    }
    const deptAPI = id == 'add' ? addDepartmentAPI : updateDepartmentAPI
    deptAPI(formObj).then(res=>{
        dispatch(getDatas({module:'departments',res}));
        setFormObj("departments", res.id);
        dispatch(showAlert({type:'success', message:`Department ${id == 'add' ? 'added' : 'updated' } successfully`}))
    }).catch(err=>{
        dispatch(showAlert({type:'error', message:err.message}))
    })
}
const { deptName, isDisabled } = formObj;
return (
    <Container maxWidth="sm">
        <Grid container spacing={2} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Grid item sx={{padding:'20px'}}>
            <TextField
                  id="deptName"
                  label="Department Name"
                  variant="outlined"
                  autoComplete="off"
                  placeholder={"Enter the Department Name"}
                  onChange={handleInput}
                  value={deptName}
                  fullWidth
                />
            </Grid>
        <Grid item>
            <FormControlLabel labelPlacement="start" control={<Switch edge="end" id="isDisabled" checked={!isDisabled} onChange={handleInput} />} label="Department Enabled" />
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

export default formWrapper(DepartmentForm);