import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Alert } from '@mui/material';
import { Autocomplete, TextField } from '@mui/material';
import { getAsObj, getLocalStorageData, setCacheTestDatas, setLocalStorageData } from '../utils/utils';

const TestForm = ({
    formType,
    toggleDrawer,
    showAlert,
    testArr,
    multiTestAdd
}) => {
    const initialState = {
        testName:'',
        testAmount: 0,
        testId: ''
    }
    const [state, setState] = useState(initialState);
    const [errState, setErrorState] = useState({})
    useEffect(()=>{
    setState({...state, ...initialState})
    },[formType])

    const labelObj = {
        testId: '',
        testName: 'Test Name',
        testAmount: 'Test Amount',
      }
    const isErrorFound=(fieldKey, statusType)=>{
        const keys = Object.keys(state);
        const errObj = {};
        let isError = false;
        const checkError = (key)=>{
        let emptyValFields = ["testName"];
        let amountFields = ["testAmount"]
        if(emptyValFields.includes(key)
        && state[key] == ''){
            errObj[key] = `${labelObj[key]} can't be Empty`;
            isError = true;
        }
        if(amountFields.includes(key) && state[key]<=0){
            errObj[key] = `${labelObj[key]} must be greater than 0`;
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
    if(val){
        setState((prevState) => ({ ...prevState,  ...val}));
    }else if(name == 'testName' && name == '' || typeof name == 'undefined'){
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
        const { testId, testName, testAmount } = state;
        const data = {
            testId: testId || Date.now(),
            testAmount,
            testName
        }
        const localStorageKey = 'addTestDatas'
        const addTestPending = getLocalStorageData(localStorageKey,'[]');
        addTestPending.push(data)
        setLocalStorageData(localStorageKey, addTestPending)
        multiTestAdd({data:setCacheTestDatas(getAsObj([data],'testId'))})
        toggleDrawer()();
        showAlert({type: 'success', message:"Test Datas Queued Successfully..."})
    }
    const { testAmount } = state;
    const { testName: nameError, testAmount: totalAmountErr } = errState;
    return(
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
                <Autocomplete
                    value={state}
                    id='testName'
                    name="testName"
                    options={testArr}
                    getOptionLabel={(option) => option.testName}
                    getOptionKey={(option) => option.testId}
                    fullWidth
                    onChange={handleInputChange}
                    renderInput={(params) => <TextField {...params} name="testName" sx={{width:'100%'}} onChange={handleInputChange} label={labelObj['testName']} fullWidth />}
                    />
                {nameError && <Alert severity="error">{nameError}</Alert>}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
                <TextField label={labelObj['testAmount']} name="testAmount" value={testAmount} onChange={handleInputChange} required fullWidth />
                {totalAmountErr && <Alert severity="error">{totalAmountErr}</Alert>}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
                <Button type="submit" variant="contained" color="primary" sx={{ padding:'10px', width: '100%' }} onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
                <Button type="submit" variant="contained" color="error" sx={{ padding:'10px', width: '100%' }} onClick={toggleDrawer(false)}>
                    Cancel
                </Button>
            </Box>
        </>
        )
}



export default TestForm;