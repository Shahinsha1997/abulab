import React, { useState, useEffect, useMemo } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Alert, Checkbox, Container, FormControlLabel, Grid, InputAdornment } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { MULTI_REPORT_ADD, dummyArr, dummyObj, getAsObj, getLocalStorageData, isUnitNeededText, setCacheTestDatas, setLocalStorageData } from '../utils/utils';

const ReportForm = ({
    formType,
    toggleDrawer,
    showAlert,
    testArr,
    multiTestAdd,
    reportDetails,
    reportObj
}) => {
    const { headingArr=dummyArr, reportTestArr=dummyArr } = reportDetails;
    const initialState = {
        parentTestName:'',
        parentTestId: '',
        testAmount: 0,
        testId: '',
        testName: '',
        testValue: '',
        refRange:'',
        heading:''
    }
    const [state, setState] = useState(initialState);
    const [errState, setErrorState] = useState({})
    useEffect(()=>{
    setState({...state, ...initialState})
    },[formType])

    const labelObj = {
        testId: '',
        parentTestName: 'Map Test Name',
        heading: 'Heading',
        testName : 'Test Name',
        testAmount: 'Test Amount',
        testValue: 'Test Value',
        refRange: 'Ref Range / Description'
      }
    const isErrorFound=(fieldKey, statusType)=>{
        const keys = Object.keys(state);
        const errObj = {};
        let isError = false;
        const checkError = (key)=>{
        let emptyValFields = ["parentTestName", "testName"];
        if(emptyValFields.includes(key)
        && state[key] == ''){
            errObj[key] = `${labelObj[key]} can't be Empty`;
            isError = true;
        }
        }
        if(fieldKey){
        checkError(fieldKey)
        }else{
        keys.map(key=>checkError(key))
        }
        setErrorState({...errObj});
        return isError;
    }


    const handleInputChange = (event, val) => {
    const { name, value } = event.target;
    if(val && val.testId){
        const testObj = reportObj[val.testId];
        if(testObj){
            const { testName, parentTestName, testValue, refRange, heading } = testObj;
            setState((prevState) => ({ ...prevState, testName, parentTestName, testValue:testValue.replace(isUnitNeededText,""), refRange, heading, isUnitNeeded: testValue.includes(isUnitNeededText) }));
        }
    }
     if(name == 'isUnitNeeded'){
        setState((prevState) => ({ ...prevState, [name]: val }));
    }
    else if(val){
        setState((prevState) => ({ ...prevState,  ...val}));
    }
    else if(name == 'testName' && name == '' || typeof name == 'undefined'){
        setState((prevState) => ({ ...prevState,  ...initialState}));
    }else{
        setState((prevState) => ({ ...prevState, [name]: val || value }));
    }
    setErrorState({})
    };
    const handleSubmit = ()=>{
        if(isErrorFound()){
            return;
        }
        const { 
            testId, 
            testName, 
            parentTestName,
            testValue,
            refRange,
            heading,
            isUnitNeeded
         } = state;
        const data = {
            testId: testId || uuidv4(),
            testName,
            heading,
            refRange, 
            testValue : isUnitNeeded ? testValue+isUnitNeededText : testValue ,
            parentTestName
        }
        const localStorageKey = 'addReportDatas'
        const addTestPending = getLocalStorageData(localStorageKey,'[]');
        addTestPending.push(data);
        setLocalStorageData(localStorageKey, addTestPending)
        multiTestAdd({data:setCacheTestDatas(getAsObj([data],'testId'))},MULTI_REPORT_ADD)
        toggleDrawer()();
        showAlert({type: 'success', message:"Report Datas Queued Successfully..."})
    }
    const { 
        testId,
        testName, 
        isUnitNeeded=false, 
        testValue='', 
        refRange='',
        parentTestId,
        parentTestName,
        heading
    } = state;
    const { testName: nameError, parentTestName: parentTestNameErr } = errState;
    return(
        <Container maxWidth="sm">
        <Grid container spacing={2} sx={{display:'flex', flexDirection:'column'}}>
            <Grid item>
                <Autocomplete
                    value={{
                        testId: parentTestId,
                        testName: parentTestName
                    }}
                    id='parentTestName'
                    name="parentTestName"
                    options={testArr}
                    noOptionsText={'No Results Found'}
                    getOptionLabel={(option) => option.testName}
                    getOptionKey={(option) => option.testId}
                    fullWidth
                    onChange={(e, val)=>{handleInputChange(e,{parentTestId: val && val.testId || '', parentTestName: val && val.testName || ''})}}
                    renderInput={(params) => <TextField {...params} name="parentTestName" sx={{width:'100%'}} onChange={handleInputChange} label={labelObj['parentTestName']} fullWidth />}
                    />
                {parentTestNameErr && <Alert severity="error">{parentTestNameErr}</Alert>}
            </Grid>
            <Grid item>
                <Autocomplete
                    value={heading}
                    id='heading'
                    name="heading"
                    options={headingArr}
                    noOptionsText={'No Results Found'}
                    fullWidth
                    onChange={(e, val)=>handleInputChange(e,{'heading': val})}
                    renderInput={(params) => <TextField {...params} name="heading" sx={{width:'100%'}} onChange={handleInputChange} label={labelObj['heading']} fullWidth />}
                    />
            </Grid>
            <Grid item>
                <Autocomplete
                    value={{
                        testId,
                        testName
                    }}
                    id='testName'
                    name="testName"
                    options={reportTestArr}
                    noOptionsText={'No Results Found'}
                    getOptionLabel={(option) => option.testName}
                    getOptionKey={(option) => option.testId}
                    fullWidth
                    onChange={(e, val)=>handleInputChange(e,{testId: val && val.testId || '', testName: val && val.testName || ''})}
                    renderInput={(params) => <TextField {...params} name="testName" sx={{width:'100%'}} onChange={handleInputChange} label={labelObj['testName']} fullWidth />}
                    />
                {nameError && <Alert severity="error">{nameError}</Alert>}
                {testId && <Alert severity="info">You're Editing this Record</Alert>}
            </Grid>
            <Grid item>
                    <FormControlLabel
                        control={<Checkbox name='isUnitNeeded' checked={isUnitNeeded} onChange={handleInputChange} />}
                        label="Is Unit Needed"
                        />
            </Grid>
            <Grid item>
            <TextField 
                label={labelObj['testValue']} 
                name="testValue" 
                value={testValue} 
                onChange={handleInputChange}
                multiline={!isUnitNeeded}
                fullWidth 
                placeholder={isUnitNeeded ? 'Provide with ,(Comma) if more than one unit' : 'Provide the default value'}
            />
            </Grid>
            <Grid item>
                <TextField 
                    label={labelObj['refRange']} 
                    name="refRange" 
                    value={refRange} 
                    onChange={handleInputChange} 
                    required 
                    multiline
                    rows={4}
                    fullWidth
                />
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



export default ReportForm;