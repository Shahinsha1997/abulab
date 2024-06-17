import React, { useState } from 'react';
import { 
    Container, 
    Grid, 
    Typography, 
    TextField, 
    Button, 
    Select, 
    MenuItem, 
    Box,
    Alert,
    InputLabel,
    FormControl,
    InputAdornment,
    Snackbar,
    CircularProgress
} from '@mui/material';
import { PREFIX_NAMES_LIST, getLocalStorageData } from '../utils/utils';
import '../css/appoinmentpage.css'
import { MAX_DAYS_FOR_APPOINTMENT, MAX_TIME, getMessage } from '../utils/appoinmentutil';
import { useDispatch } from 'react-redux';
import { addAppointmentAPI } from '../actions/APIActions';
import { showAlert } from '../dispatcher/action';
function AppointmentForm() {
  const initialState = {
    gender: PREFIX_NAMES_LIST[0],
    name: '',
    mobileNumber: '',
    appointmentDate: '',
    appointmentTime: '',
    address:'',
    drName: '',
    age: '',
  }
  const [formData, setFormData] = useState(initialState);
  const [alert, setAlert] = useState({})
  const [isInProgress, setIsInprogress] = useState(false)
  const [errorData, setErrorData] = useState({
    appointmentDateErr: '',
    mobileNumberErr: ''
  })
  const closeAlert = ()=>{
    setAlert({})
  }
  const dispatch = useDispatch();
  const isErrorFound=(fieldKey, statusType)=>{
    const errObj = {};
    let isError = false;
    const checkError = (key)=>{
      const value = formData[key];
      if(key == 'appointmentDate'){
        const currentDate = Date.now();
        const maxDate = currentDate + MAX_DAYS_FOR_APPOINTMENT*60*60*24*1000
        const selectedDate = new Date(value).setHours(0,0,0,0)
        let errorMessage =''
        if(selectedDate > maxDate){
          errorMessage= getMessage(key, 'error');
        }else if(new Date().getHours() >= MAX_TIME && selectedDate == new Date(currentDate + 24 * 60 * 60 * 1000).setHours(0,0,0,0) || selectedDate < currentDate){
          errorMessage = getMessage(key, 'maxTimeError');
        }else if(value == ''){
          errorMessage = getMessage(key, 'emptyError');
        }
        errObj['appointmentDateErr'] = errorMessage;
        isError = errorMessage ? true : isError; 
      }else if(key == 'mobileNumber'){
        if(value.length != 10 || isNaN(value)){
          errObj['mobileNumberErr']= getMessage(key, 'error')
          isError = true;
        }
      }
      else if(key =='address'){
        if(value == ''){
          errObj['addressErr'] = getMessage(key, 'error')
          isError = true;
        }
      }
      else if(key =='name'){
        if(value == ''){
          errObj['nameErr'] = getMessage(key, 'error')
          isError = true;
        }
      }
    }
    if(fieldKey){
      checkError(fieldKey)
    }else{
      const keys = Object.keys(formData);
      keys.map(key=>checkError(key))
    }
    setErrorData({...errObj});
    return isError;
  }

  const getAlertContent = () =>{
    const { type, message } = alert;
    return (
      <Snackbar
        open={true}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position
      >
        <Alert severity={type} onClose={closeAlert}>{message}</Alert>
      </Snackbar>
    )
  }
  const handleChange = (event) => {
    let { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrorData({})
    // isErrorFound(name)
  };
  const handleSubmit = (event) => {
    const { gender, name, mobileNumber, address, appointmentDate, age, drName } = formData;
    event.preventDefault();
    if(isErrorFound()){
      return;
    }
    setIsInprogress(true)
    addAppointmentAPI({
      name: gender+name,
      age,
      drName: drName && !drName.includes('Dr') ? 'Dr.'+drName : drName,
      mobileNumber,
      address,
      appointmentDate: new Date(appointmentDate).setHours(0,0,0,0)
    }).then(res=>{
      setIsInprogress(false)
      setAlert({type: 'success', message:getMessage('addAPI','success')})
      setFormData(initialState);
    }).catch(err=>{
      setIsInprogress(false)
      setAlert({type: 'error', message:getMessage('addAPI','fail')})
    })
  };

  const handleReset = () => {
    setFormData(initialState);
  };
  const {id:isUserLoggedIn} = getLocalStorageData('userObj','{}')
  const { gender, name, mobileNumber, address, appointmentDate, age, drName } = formData;
  const { nameErr, mobileNumberErr, addressErr, drNameErr, appointmentDateErr } = errorData;
  return (
    <Container maxWidth="sm">
      {
        alert.type ? getAlertContent() : null
        
      }
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div style={{ display: 'flex',justifyContent: 'center', padding:'10px' }}>
            <Box sx={{display:'flex',flexDirection:'column'}} >
              <img
                src="./AbuLabLogoHeader.png"
                alt="Abulab"
                style={{ maxWidth: '100%', maxHeight: '150px', width:'200px' }}
              />
            <img
                src="./AbuLabLogoFooter.png"
                alt="Abulab"
                style={{ maxWidth: '100%', maxHeight: '150px', width:'200px' }}
              />
            </Box>
          </div>
          <Typography align="center">
            Book an Appointment with us for Home Visit.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            <Box sx={{display:'flex', flexDirection:'column', padding:2}}>
              <Box sx={{display:'flex', flexDirection:'row'}}>
                  <Select value={gender} name="gender" onChange={(e)=>handleChange(e)}>
                      {PREFIX_NAMES_LIST.map(gender=>
                          <MenuItem value={gender}>{gender}</MenuItem>
                      )}
                  </Select>
                  <TextField
                      name="name"
                      label="Name"
                      variant="outlined"
                      fullWidth
                      value={name}
                      onChange={handleChange}
                      error={nameErr}
                  />
                  <TextField
                      name="age"
                      label="Age"
                      variant="outlined"
                      value={age}
                      inputProps={{
                        maxLength: 3
                      }}
                      onChange={handleChange}
                  />
              </Box>
              {nameErr && <Alert severity="error">{nameErr}</Alert>}
            </Box>
            <Box sx={{padding:2}}>
                <TextField
                  name="mobileNumber"
                  label="Mobile Number"
                  variant="outlined"
                  fullWidth
                  value={mobileNumber}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: 10
                  }}
                  error={mobileNumberErr}
                />
                {mobileNumberErr ? 
                <Alert severity="error">{mobileNumberErr}</Alert> : 
                mobileNumber.length == 0 ? <Alert severity="info" sx={{fontSize:'12px'}}>{getMessage('mobileNumber', 'info')}</Alert> : null}
            </Box>
            <Box sx={{padding:2}}>
                <TextField
                  name="address"
                  label="Address"
                  variant="outlined"
                  fullWidth
                  value={address}
                  onChange={handleChange}
                  error={addressErr}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Melapalayam, TVL</InputAdornment>,
                  }}
                />
                {addressErr ? <Alert severity="error">{addressErr}</Alert> :
                address.length == 0 ? <Alert severity="info">{getMessage('address','info')}</Alert> : null}
            </Box>
            <Box sx={{padding:2}}>
              <TextField
                name="appointmentDate"
                label="Date for Appointment"
                variant="outlined"
                fullWidth
                type="date"
                value={appointmentDate}
                onChange={handleChange}
                error={appointmentDateErr}
                InputLabelProps={{ shrink: true }}
              />
            {appointmentDateErr && <Alert severity="error">{appointmentDateErr}</Alert>}
            </Box>
            <Box sx={{padding:2}}>
                <TextField
                name="drName"
                label="Ref Doctor"
                variant="outlined"
                fullWidth
                value={drName}
                onChange={handleChange}
                error={drNameErr}
                InputProps={{
                  startAdornment: <InputAdornment>Dr. </InputAdornment>,
                }}
                />
                {drNameErr && <Alert severity="error">{drNameErr}</Alert>}
            </Box>
            <Box sx={{padding:2}}>

            {/* <FormControl fullWidth disabled={formData.appointmentDate == ''}>
                <InputLabel id="time-select-label">Select Time</InputLabel>
                <Select
                    labelId="time-select-label"
                    id="time-select"
                    value={''}
                    label="Select Time"
                    name="appointmentTime"
                    onChange={handleChange}
                >
                    {timeSlots.map((timeSlot) => (
                    <MenuItem key={timeSlot} value={timeSlot}>
                        <em>{timeSlot}</em>
                    </MenuItem>
                    ))}
                </Select>
            </FormControl> */}
            {/* <TextField
              name="appointmentTime"
              label="Available Slots"
              variant="outlined"
              fullWidth
              type="time"
              value={formData.appointmentTime}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            /> */}
            </Box>
            <Box sx={{padding:2}}>
            <Grid container spacing={2} justifyContent="flex-end">
              <Grid item>
                <Button variant="contained" disabled={isInProgress} type="submit" color="primary">
                  {isInProgress ? (<CircularProgress size={25}/>) : "Submit"}
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="secondary" onClick={handleReset}>
                  Reset
                </Button>
              </Grid>
              {isUserLoggedIn ? (
                <Grid item>
                  <Button variant="contained" color="warning" onClick={()=>window.open('/dashboard','_self')}>
                    Lab View
                  </Button>
                </Grid>
              ) : null}
            </Grid>
            </Box>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AppointmentForm;