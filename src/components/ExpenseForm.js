import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Alert, Container, Grid, InputAdornment } from '@mui/material';
import { FormControlLabel, Checkbox } from '@mui/material';
import { EXPENSE_LABEL, getAmountVal, getAsObj, getEditedFormProperties, getLocalStorageData, isFormErrorFound, setLocalStorageData } from '../utils/utils';
import { v4 as uuidv4 } from 'uuid';

const ExpenseForm = ({
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
        adminVisibilty: false,
        isExternalLab: false,
        time: Date.now(),
        uuid: uuidv4(),
      }, ...(getEditedFormProperties(data[formType]))})
      const [state, setState] = React.useState(initialState);
      const [errState, setErrorState] = React.useState({});
      React.useEffect(()=>{
        setState({...state, ...initialState})
      },[formType])
      const handleInputChange = (event, val) => {
        let { name='drName', value } = event.target;
        if(name == 'adminVisibilty' || name == 'isExternalLab'){
          value = val;
        }
        setState((prevState) => ({ ...prevState, [name]: val || value }));
        setErrorState({})
      };
const handleExpenseSubmit = (event)=>{
    event.preventDefault();
    const { 
        name, 
        totalAmount, 
        description, 
        adminVisibilty,
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
        fullName += adminVisibilty ? '|Admin Only' : '';
        fullName += isExternalLab ? '|External Lab' : ''
        return fullName
    }
    const payload = Object.assign({
        uuid: uuid,
        time: isAddForm ? Date.now() : time,
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
    adminVisibilty,
    isExternalLab 
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
                <Grid item>
                <FormControlLabel
                    control={<Checkbox name='adminVisibilty' checked={adminVisibilty} onChange={handleInputChange} />}
                    label="Visibility to Only Admin"
                    />
                </Grid>
            ) : null}
            <Grid item>
                <FormControlLabel
                    control={<Checkbox name='isExternalLab' checked={isExternalLab} onChange={handleInputChange} />}
                    label="Is External Lab Expense?"
                    />
            </Grid>
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



export default ExpenseForm;