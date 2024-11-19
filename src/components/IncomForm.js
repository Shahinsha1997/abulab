import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import { v4 as uuidv4 } from 'uuid';
import { APPOINTMENTS_VIEW, OUTSTANDING_LABEL, PREFIX_NAMES_LIST, getAmountVal, getAsObj, getEditedFormProperties, getLocalStorageData, getProperId, getStatus, getTimeWithDate, isFormErrorFound, setLocalStorageData } from '../utils/utils';
import { Autocomplete, TextField, Chip, Container, Grid, InputAdornment, Link } from '@mui/material';
const IncomeForm = ({ 
    getIdPrefix, 
    toggleDrawer,
    isAdmin,
    isAddForm,
    drNamesList,
    testObj,
    testArr,
    dueWithMobile,
    previousID,
    setPreviousId,
    data,
    formType,
    addData,
    setSyncStatus,
    showAlert,
    page,
    toggleForm,
    patientIdObj,
    setDetailViewId
}) => {
    const initialState = ({...{
        open: false,
        time: Date.now(),
        uuid: uuidv4(),
        patientId: getProperId(previousID+1),
        name: '',
        mobileNumber: '',
        description:'',
        testsArr:[],
        drName:'',
        discount:0,
        totalAmount: '0',
        paidAmount: '0',
        comments: '',
        namePrefix: 'Mrs.'
        }, ...(getEditedFormProperties(data[formType],testObj))})
    const [state, setState] = React.useState(initialState);
    const [errState, setErrorState] = React.useState({});
    const handleTest = (e,values)=>{
        let totalAmount = 0;
        let description= ''
        values.map(val=>{
        description += val.testName+"|"
        totalAmount += parseInt(val.testAmount || 0)
        })
        setState((prevState) => ({ ...prevState, description, testsArr:values, totalAmount }))
    }
    React.useEffect(()=>{
     setState({...state, patientId: getProperId(previousID+1)})
    },[previousID])
  React.useEffect(()=>{
    setState({...state, ...initialState})
  },[formType])
  const handleInputChange = (event, val) => {
    let { name='drName', value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: val || value }));
    setErrorState({})
  };
  const openExist = ()=>{
    const id = patientIdObj[state.patientId];
    setDetailViewId(id, false);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const { 
      patientId,
      name, 
      mobileNumber, 
      totalAmount, 
      paidAmount, 
      description, 
      drName, 
      comments, 
      namePrefix, 
      discount,
      uuid,
      time
    } = state;
    const dueAmount = totalAmount- parseInt(discount) - paidAmount
    const status = getStatus(true, dueAmount)
    const { isError, errObj } = isFormErrorFound('',status,state)
    if(isAddForm && dueWithMobile[mobileNumber]?.isBlockedUser){
        return setErrorState({mobileNumber:'User Blocked By Management Team'})  
    }
    if(isError){
      return setErrorState(errObj)
    }
    const localStorageKey = isAddForm ? 'addPendingDatas' : 'updatePendingDatas'
    const addPending = getLocalStorageData(localStorageKey,'[]');
    
    const data = Object.assign({
      uuid: uuid,
      time: isAddForm ? Date.now() : time,
      patientId: patientId, 
      name: namePrefix+name,
      mobileNumber, 
      status,
      drName,
      description,
      isBlockedUser: false,
      modifiedTime: Date.now(),
      discount : getAmountVal(discount),
      totalAmount : getAmountVal(totalAmount), 
      paidAmount:  getAmountVal(paidAmount), 
      dueAmount: getAmountVal(dueAmount),
      isScheduled: true,
      comments
    })
    addPending.splice(0,0,data)
    setLocalStorageData(localStorageKey, addPending)
    addData({data: getAsObj([data])});
    toggleDrawer()();
    if(isAddForm){
      setPreviousId(patientId)
      setState(initialState)
      page != APPOINTMENTS_VIEW ? toggleForm(formType) : null
    }else{
      setSyncStatus(true);
      setTimeout(()=>setSyncStatus(false),1)
    }
    showAlert({type: 'success', message:isAddForm ? "Datas Queued for Income Add Successfully..." : "Datas Queued for Income Update successfully"})
  };
    const { patientId, name, mobileNumber, discount=0, description,testsArr, drName, totalAmount, paidAmount, comments, namePrefix } = state;
    const { name: nameError, description: descriptionErr, mobileNumber: mobileNumberErr, drName: drNameErr, totalAmount: totalAmountErr, paidAmount: paidAmountErr } = errState;
    const isFieldDisabled = !(isAddForm || isAdmin)
    const dueAmount = (totalAmount-discount-paidAmount);
    return(
        <Container maxWidth="sm">
            <Grid container spacing={2} sx={{display:'flex', flexDirection:'column'}}>
                <Grid item sx={{ display: 'flex', flexDirection:'column' }}>
                    <Grid item>
                        <TextField
                            label="Patient ID"
                            name="patientId"
                            value={patientId}
                            onChange={handleInputChange}
                            required
                            fullWidth
                            InputProps={{
                                startAdornment: <InputAdornment position="start">{getIdPrefix()}</InputAdornment>,
                            }}
                        />
                    </Grid>
                        {(patientIdObj[patientId] && isAddForm) && 
                    <Grid item><Alert severity="info">{`Already Exist. `}<Link sx={{cursor:'pointer'}} onClick={openExist}>Click Here to Open</Link></Alert></Grid>}
                    
                </Grid>
                <Grid item>
                    <Box sx={{display:'flex'}}>
                    <Select value={namePrefix} name="namePrefix" onChange={(e)=>handleInputChange(e)}>
                        {PREFIX_NAMES_LIST.map(prefix=>
                            <MenuItem value={prefix}>{prefix}</MenuItem>
                        )}
                    </Select>
                    <TextField 
                        label="Name" 
                        name="name" 
                        value={name} 
                        onChange={handleInputChange} 
                        disabled={isFieldDisabled} 
                        required 
                        fullWidth
                    />
                    </Box>
                    {nameError && <Alert severity="error">{nameError}</Alert>}
                </Grid>
                <Grid item>
                    <TextField 
                        label="Mobile Number" 
                        name="mobileNumber" 
                        value={mobileNumber} 
                        disabled={isFieldDisabled} 
                        onChange={handleInputChange} 
                        inputProps={{
                            maxLength: 10
                        }}
                        fullWidth 
                    />
                    {(dueWithMobile[mobileNumber] && isAddForm) 
                    ? (dueWithMobile[mobileNumber].isBlockedUser 
                        ? <><Alert severity="error">User Blocked By Management Team</Alert><Alert severity="info">{`Exist Due Amount ₹ ${dueWithMobile[mobileNumber].dueAmount} from ${getTimeWithDate(dueWithMobile[mobileNumber].added_time)}`}</Alert></> 
                        : <Alert severity="info">{`Exist Due Amount ₹ ${dueWithMobile[mobileNumber].dueAmount} from ${getTimeWithDate(dueWithMobile[mobileNumber].added_time)}`}</Alert>) 
                    : mobileNumberErr 
                    ? <Alert severity="error">{mobileNumberErr}</Alert> : null}
                </Grid>
                <Grid item>
                    <Autocomplete
                        value={drName} 
                        disabled={isFieldDisabled}
                        id={'drName'}
                        name="drName"
                        options={drNamesList || []}
                        fullWidth
                        onChange={handleInputChange}
                        renderInput={(params) => <TextField {...params} name="drName" sx={{width:'100%'}} onChange={handleInputChange} label="Doctor Name" fullWidth />}
                        />
                    {/* <TextField label="Doctor Name" name="drName" value={drName} disabled={isFieldDisabled} onChange={handleInputChange} required fullWidth /> */}
                    {drNameErr && <Alert severity="error">{drNameErr}</Alert>}
                </Grid>
                <Grid item>
                        <Autocomplete
                            multiple
                            disabled={isFieldDisabled}
                            value={testsArr}
                            onChange={handleTest}
                            options={Object.values(testArr)}
                            noOptionsText={Object.values(testArr).length > 0 ? 'No Result Found' : 'Please add atleast one test from Add/Edit Test Option'}
                            getOptionLabel={(option) => option && `${option.testName} | ₹ ${option.testAmount}` || ''}
                            getOptionKey={(option) => option && option.testId || ''}
                            renderTags={(value, getTagProps) => value.map((option, index) => (
                                <Chip key={option.testId} label={`${option.testName} | ₹ ${option.testAmount}`} {...getTagProps({ index })} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField {...params} label="Select Tests" placeholder="Search..." />
                            )}
                        />
                    {/* <TextField label="Description" name="description" value={description} disabled={isFieldDisabled} onChange={handleInputChange} required fullWidth /> */}
                    {descriptionErr && <Alert severity="error">{descriptionErr}</Alert>}
                </Grid>
                <Grid item>
                    <TextField 
                        sx={{width:'60%'}} 
                        label="Total Amount" 
                        name="totalAmount" 
                        value={totalAmount} 
                        disabled={isFieldDisabled} 
                        onChange={handleInputChange} 
                        required 
                        fullWidth 
                        InputProps={{
                            startAdornment: <InputAdornment position="start">₹ </InputAdornment>,
                        }}
                    />
                    <TextField 
                        sx={{width:'40%'}} 
                        label="Discount" 
                        name="discount" 
                        value={discount} 
                        onChange={handleInputChange} 
                        required 
                        fullWidth 
                        InputProps={{
                            startAdornment: <InputAdornment position="start">₹ </InputAdornment>,
                        }}
                    />
                    {totalAmountErr && <Alert severity="error">{totalAmountErr}</Alert>}
                </Grid>
                <Grid item>
                    <TextField 
                        label="Paid Amount" 
                        name="paidAmount" 
                        value={paidAmount} 
                        onChange={handleInputChange} 
                        required 
                        fullWidth 
                        InputProps={{
                            startAdornment: <InputAdornment position="start">₹ </InputAdornment>,
                        }}
                    />
                    {paidAmountErr && <Alert severity="error">{paidAmountErr}</Alert>}
                </Grid>
                <Grid item>
                    <TextField 
                        label="Due Amount" 
                        name="dueAmount" 
                        value={dueAmount} 
                        onChange={handleInputChange} 
                        disabled 
                        fullWidth 
                        InputProps={{
                            startAdornment: <InputAdornment position="start">₹ </InputAdornment>,
                        }}
                    />
                    {(dueAmount) < 0 && <Alert severity="error">Due amount is less than 0</Alert>}
                </Grid>
                <Grid item>
                    <TextField label="Comments / Remarks" name="comments" value={comments} onChange={handleInputChange} fullWidth />
                </Grid>
                <Grid item>
                    <Button type="submit" variant="contained" color="primary" sx={{ padding:'10px', width: '100%' }} onClick={handleSubmit}>
                        Submit
                    </Button>
                </Grid>
                <Grid item>
                    <Button type="submit" variant="contained" color="error" sx={{ padding:'10px', width: '100%' }} onClick={toggleDrawer(false)}>
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </Container>
)}



export default IncomeForm;