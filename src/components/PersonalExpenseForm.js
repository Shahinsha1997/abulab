import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Alert, Container, Grid, InputAdornment } from '@mui/material';
import { FormControlLabel, Checkbox } from '@mui/material';
import { EXPENSE_LABEL, getAmountVal, getAsObj, getEditedFormProperties, getLocalStorageData, isFormErrorFound, setLocalStorageData } from '../utils/utils';
import { v4 as uuidv4 } from 'uuid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers';
// import { format } from 'date-fns';
const PersonalExpenseForm = ({
    toggleDrawer,
    isAdmin,
    formType,
    isAddForm,
    data,
    addData,
    setSyncStatus,
    showAlert
}) => {
    const initialState = ({...{
        open: false,
        name: '',
        description:'',
        totalAmount: '0',
        time: Date.now(),
        uuid: uuidv4(),
      }, ...(getEditedFormProperties(data[formType]))})
      const [state, setState] = React.useState(initialState);
      const [errState, setErrorState] = React.useState({});
      React.useEffect(()=>{
        setState({...state, ...initialState})
      },[formType])
      const handleInputChange = (event, val) => {
        if(event.$d){
            setState((prevState) => ({ ...prevState, time: new Date(event.$d).getTime()}));
            return setErrorState({})
        }
        let { name='drName', value } = event.target;
        setState((prevState) => ({ ...prevState, [name]: val || value }));
        setErrorState({})
      };
const handleExpenseSubmit = (event)=>{
    event.preventDefault();
    const { 
        name, 
        totalAmount, 
        description,
        time,
        uuid
    } = state;
    const { isError, errObj } = isFormErrorFound('',EXPENSE_LABEL,state)
    if(isError){
        return setErrorState(errObj)
    }
    const localStorageKey = isAddForm ? 'addPendingDatas' : 'updatePendingDatas'
    const addPending = getLocalStorageData(localStorageKey,'[]');
    const getFullName = ()=>{
        let fullName = name;
        fullName +=  '|Personal Expense|Admin Only';
        return fullName
    }
    const payload = Object.assign({
        uuid: uuid,
        time: time,
        patientId: '', 
        name: getFullName(),
        mobileNumber: '', 
        status: EXPENSE_LABEL,
        drName: '',
        description,
        discount: 0,
        totalAmount : getAmountVal(totalAmount), 
        paidAmount:  getAmountVal(totalAmount), 
        dueAmount: 0,
        isScheduled: true,
        comments: ''
    })
    addPending.splice(0,0,payload)
    setLocalStorageData(localStorageKey, addPending)
    addData({data: getAsObj([payload])});
    toggleDrawer()();
    if(!isAddForm){
        setSyncStatus(true);
        setTimeout(()=>setSyncStatus(false),1)
    }
    showAlert({type: 'success', message:isAddForm ? "Datas Queued for Expense Add Successfully..." : "Datas Queued for Expense Update successfully"})
}
const {
    name, 
    description, 
    status, 
    totalAmount,
    time
} = state;
const { 
    name: nameError, 
    description: descriptionErr, 
    totalAmount: totalAmountErr
} = errState;
return(
    <Container maxWidth="sm">
        <Grid container spacing={2} sx={{display:'flex', flexDirection:'column'}}>
            <Grid item>
                <TextField label="Name" name="name" value={name} onChange={handleInputChange} required fullWidth />
                {nameError && <Alert severity="error">{nameError}</Alert>}
            </Grid>
            <Grid item>
                <TextField label="Description" name="description" value={description} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item>
                <TextField 
                    label="Total Amount" 
                    name="totalAmount" 
                    value={totalAmount} 
                    onChange={handleInputChange} 
                    fullWidth  
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₹ </InputAdornment>,
                    }}
                />
                {totalAmountErr && <Alert severity="error">{totalAmountErr}</Alert>}
            </Grid>
            {isAdmin ? (
                <>
                <Grid item>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DateTimePicker
                            sx={{minWidth:'100%'}}
                            label="Select Date Time"
                            value={dayjs(time)}
                            onChange={handleInputChange}
                            name='time'
                            format='DD/MM/YYYY hh:mm a'
                        />
                    </LocalizationProvider>
                </Grid>
                </>
            ) : null}
            <Grid item>
                <Button type="submit" variant="contained" color="primary" sx={{ padding:'10px', width: '100%' }} onClick={handleExpenseSubmit}>
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
    )
}



export default PersonalExpenseForm;