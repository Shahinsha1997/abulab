import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { Alert } from '@mui/material';


const IncomeForm = ({
    handleInputChange, 
    getIdPrefix, 
    state,
    isMobile,
    toggleDrawer,
    handleSubmit,
    errState={}
}) => {
const { patientId, name, mobileNumber, description, drName, status, totalAmount, paidAmount } = state;
const { name: nameError, description: descriptionErr, mobileNumber: mobileNumberErr, drName: drNameErr, totalAmount: totalAmountErr, paidAmount: paidAmountErr } = errState;
return(
    <>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <TextField label="Name" name="name" value={name} onChange={handleInputChange} required fullWidth={isMobile} />
            {nameError && <Alert severity="error">{nameError}</Alert>}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <TextField label="Description" name="description" value={description} onChange={handleInputChange} required fullWidth={isMobile} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <TextField label="Total Amount" name="totalAmount" value={totalAmount} onChange={handleInputChange} required fullWidth={isMobile} />
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



export default IncomeForm;