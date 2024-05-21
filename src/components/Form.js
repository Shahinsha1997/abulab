import * as React from 'react';
import { useMediaQuery } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { EXPENSE_LABEL, getAsObj, getIdPrefix, getLocalStorageData, getProperId, getStatus, setLocalStorageData } from '../utils/utils';
import { addDataAPI } from '../actions/APIActions';
import IncomeForm from './IncomForm';
import ExpenseForm from './ExpenseForm'
const Form = ({
  addData, 
  formType, 
  toggleForm, 
  multiAdd, 
  previousID, 
  showAlert,
  setPreviousId,
  setSyncStatus
}) => {
  const isIncomeForm = formType.indexOf('Income')!=-1;
  const initialState = {
    open: false,
    patientId: getProperId(previousID+1),
    name: '',
    mobileNumber: '',
    description:'',
    drName:'',
    totalAmount: '0',
    paidAmount: '0',
    isAddInProgress: false
  }
  const labelObj = {
    patientId: "Patiend ID",
    name: 'Name',
    mobileNumber: 'Mobile Number',
    description:'Description',
    drName:'Dr Name',
    totalAmount: 'Total Amount',
    paidAmount: 'Paid Amount',
  }
  const [state, setState] = React.useState(initialState);
  const [errState, setErrorState] = React.useState({});

  const isMobile = useMediaQuery('(max-width: 600px)');

  React.useEffect(()=>{
    setState({...state, patientId: getProperId(previousID+1)})
  },[previousID])
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
    setErrorState({})
  };


  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({...initialState})
    toggleForm()
  };
  const isErrorFound=(fieldKey, statusType)=>{
    const keys = Object.keys(state);
    const errObj = {};
    let isError = false;
    const checkError = (key)=>{
      let emptyValFields = ["patientId","name","mobileNumber","description","drName"];
      let amountFields = ["totalAmount","paidAmount"]
      if(statusType == EXPENSE_LABEL){
        emptyValFields = ["name","description"];
        amountFields = ["totalAmount"]
      }
      if(emptyValFields.includes(key)
      && state[key] == ''){
        errObj[key] = `${labelObj[key]} can't be Empty`;
        isError = true;
      }
      if(amountFields.includes(key) && state[key]<=0){
        errObj[key] = `${labelObj[key]} can't be less then 0`;
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const { patientId, name, mobileNumber, totalAmount, paidAmount, description, drName} = state;
    const status = getStatus(formType, totalAmount-paidAmount)
    if(isErrorFound('',status)){
      return;
    }
    const addPending = getLocalStorageData('addPendingDatas','[]');
    const data = Object.assign({
      time: Date.now(),
      patientId: status == EXPENSE_LABEL ? '' : patientId, 
      name, 
      mobileNumber, 
      status,
      drName,
      description,
      totalAmount, 
      paidAmount:  status == EXPENSE_LABEL ? totalAmount : paidAmount, 
      dueAmount: status == EXPENSE_LABEL ? 0 : totalAmount - paidAmount,
      isScheduled: true
    })
    addPending.splice(0,0,data)
    setLocalStorageData('addPendingDatas', addPending)
    addData({data: getAsObj([data])});
    toggleDrawer()();
    if(status != EXPENSE_LABEL){
      setPreviousId(patientId)
    }
    if(addPending.length > 10){
      setState({...initialState, isAddInProgress: true})
      setSyncStatus(false)
      return addDataAPI().then((res)=>{
        multiAdd({data:res})
        setState({...initialState, isAddInProgress: false})
        showAlert({type: 'success', message:"Datas Sync done successfully..."})
        setSyncStatus(true)
      }).catch(err=>{
        setSyncStatus(true)
        console.log('Err',err)
        showAlert({type: 'error', message:"Datas doesn't sync properly..."})
      })
    }else{
      showAlert({type: 'success', message:"Datas Queued Successfully..."})
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={formType}
      >
        <Box sx={{width: isMobile ? "500px" : "350px"}}>
        <List dense={true}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="close" onClick={toggleDrawer(false)}>
                      <CloseIcon/>
                    </IconButton>
                  }
                >
                    <Typography gutterBottom variant="h5" component="div">
                     {isIncomeForm ? 'Add Income Form' : 'Add Expenses'}
                    </Typography>
                </ListItem>
            </List>
            {isIncomeForm ? (
              <IncomeForm
              handleInputChange={handleInputChange}
              getIdPrefix={getIdPrefix}
              state={state}
              isMobile={isMobile}
              handleSubmit={handleSubmit}
              toggleDrawer={toggleDrawer}
              errState={errState}
            />
            ) : (
              <ExpenseForm
                handleInputChange={handleInputChange}
                getIdPrefix={getIdPrefix}
                state={state}
                isMobile={isMobile}
                handleSubmit={handleSubmit}
                toggleDrawer={toggleDrawer}
                errState={errState}
              />
            )}
            
        </Box>
      </Drawer>
    </>
  );
};

export default Form;
